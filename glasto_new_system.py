from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium_stealth import stealth
import string
import random

import tempfile

import tkinter as tk
from threading import Thread, Event
from tkinter.font import Font
import argparse

import pygame  # For sound playback
import os
import sys
import time

# Initialize pygame mixer
pygame.mixer.init()

# Use threading event for stopping the entire program
stop_refresh_event = Event()

# List to keep track of active drivers and browser instances
active_drivers = []
browser_instances = []
browser_widgets = {}

# Initialize a counter for browser IDs
browser_id_counter = 1

# Load the sound file
sound_path = os.path.join(os.path.dirname(__file__), "alert.wav")
if os.path.exists(sound_path):
    alert_sound = pygame.mixer.Sound(sound_path)
else:
    print("Alert sound file not found. Sound alerts will be disabled.")
    alert_sound = None

alert_div = """
    var alertDiv = document.createElement('div');
    alertDiv.id = 'customAlert';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '0';
    alertDiv.style.left = '0';
    alertDiv.style.width = '100%';
    alertDiv.style.height = '100%';
    alertDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    alertDiv.style.display = 'flex';
    alertDiv.style.justifyContent = 'center';
    alertDiv.style.alignItems = 'center';
    alertDiv.style.zIndex = '9999';

    var alertContent = document.createElement('div');
    alertContent.style.backgroundColor = 'red';
    alertContent.style.padding = '40px';
    alertContent.style.borderRadius = '10px';
    alertContent.style.color = 'white';
    alertContent.style.fontSize = '24px';
    alertContent.style.fontWeight = 'bold';
    alertContent.style.textAlign = 'center';
    alertContent.innerText = 'Key string found! Attention!\\nClick to dismiss.';

    alertDiv.appendChild(alertContent);
    document.body.appendChild(alertDiv);

    alertDiv.onclick = function() {
        document.body.removeChild(alertDiv);
    };
"""

def setup_driver():
    # Create a unique temporary directory for user data for each instance
    user_data_dir = tempfile.mkdtemp()
    
    chrome_options = Options()
    chrome_options.add_argument(f"--user-data-dir={user_data_dir}")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--remote-debugging-port=0")  # Prevents reuse of the debugging port
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    chrome_options.add_experimental_option("detach", True)
    chrome_options.add_argument("start-maximized")
    chrome_options.add_argument(f'user-agent={''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))}')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    active_drivers.append(driver)
    
    #stealth(driver,
    #    languages=["en-US", "en"],
    #    vendor="Google Inc.",
    #    platform="Win32",
    #    webgl_vendor="Intel Inc.",
    #    renderer="Intel Iris OpenGL Engine",
    #    fix_hairline=True,
    #    )
    return driver

class BrowserInstance:
    def __init__(self, driver, id, individual_stop_event):
        self.driver = driver
        self.id = id
        self.status = "Initializing"
        self.individual_stop_event = individual_stop_event
        self.is_monitoring = True
        self.key_string_found = False
        self.clicked = False
        self.driver.execute_script(f"document.title = 'Browser {id}'")

def check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_strings):
    try:
        wednesday_buttons = driver.find_elements(
            By.XPATH, "//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'wednesday')]"
        )
        if wednesday_buttons:
            if "sold out" in wednesday_buttons[0].text.lower():
                thursday_buttons = driver.find_elements(
                    By.XPATH, "//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'thursday')]"
                )
                if thursday_buttons:
                    thursday_buttons[0].click()
                    print(f"'Wednesday' sold out, clicked 'Thursday' button in {driver}!")
                    browser_instance.status = "'Wednesday' sold out, clicked 'Thursday'"
                    browser_instance.clicked = True
            else:
                wednesday_buttons[0].click()
                print(f"Clicked a 'Wednesday' button in {driver}!")
                browser_instance.status = "Clicked 'Wednesday' button"
                browser_instance.clicked = True

        current_content = driver.page_source
        for key_string in key_strings:
            if key_string in current_content:
                print(f"Key string found in {driver}!")
                browser_instance.status = "Key string found!"
                browser_instance.key_string_found = True

                try:
                    driver.execute_script(alert_div)
                except Exception as js_e:
                    print(f"Error displaying alert in browser {driver}: {js_e}")

                if alert_sound:
                    try:
                        alert_sound.play()
                    except Exception as sound_e:
                        print(f"Error playing sound via pygame: {sound_e}")

                return True
            else:
                browser_instance.status = f"'{key_string}' not found, monitoring continues."
                return False
    except Exception as e:
        print(f"Error checking page in {driver}: {e}")
        browser_instance.status = f"Error: {e}"
        return False

def monitor_webpage_until_change(
    driver, browser_instance, url, key_strings, individual_stop_event=None
):
    try:
        driver.get(url)  # Initial page load
        browser_instance.status = "Monitoring..."

        while not stop_refresh_event.is_set() and (
            individual_stop_event is None or not individual_stop_event.is_set()
        ):
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            driver.execute_script(f"document.title = 'Browser {browser_instance.id}'")

            # Check for the key string and "Wednesday" button
            if check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_strings):
                print(f"Key string found, stopping monitoring for Browser {browser_instance.id}.")
                if individual_stop_event:
                    individual_stop_event.set()
                break  # Key string found, exit loop

            # Monitor for redirects during the interval
            current_url = driver.current_url

            if driver.current_url != current_url:
                # Handle URL redirect
                current_url = driver.current_url
                browser_instance.status = f"Redirected to {current_url}"
                print(f"Redirect detected in {driver}. New URL: {current_url}")
                WebDriverWait(driver, 10).until(
                    lambda d: d.execute_script("return document.readyState") == "complete"
                )
                driver.execute_script(f"document.title = 'Browser {browser_instance.id}'")
                
                # Check the page again after redirect
                if check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_strings):
                    print(f"Key string found after redirect, stopping monitoring for Browser {browser_instance.id}.")
                    if individual_stop_event:
                        individual_stop_event.set()
                    break  # Key string found, exit loop

            if stop_refresh_event.is_set() or (
                individual_stop_event and individual_stop_event.is_set()
            ):
                break
            time.sleep(0.1)  # Adjust the sleep interval as needed

    except Exception as e:
        print(f"Error during monitoring in Browser {browser_instance.id}: {e}")
        browser_instance.status = f"Error: {e}"
        
    # Additional logic to update button text when monitoring stops
    browser_instance.is_monitoring = False  # Set the monitoring status to False
    if browser_instance.key_string_found:
        browser_instance.status = "Key string found!"
    elif browser_instance.individual_stop_event.is_set():
        browser_instance.status = "Monitoring stopped by user."
    elif stop_refresh_event.is_set():
        browser_instance.status = "Program stopped."
    else:
        browser_instance.status = "Monitoring stopped."
    
    # Update button text in the GUI
    browser_widgets[browser_instance.id]["button_text"].set("Start Monitoring")
        

def open_in_browsers(url, iterations):
    global browser_id_counter
    for _ in range(iterations):
        driver = setup_driver()
        individual_stop_event = Event()
        browser_id = browser_id_counter
        browser_id_counter += 1
        browser_instance = BrowserInstance(driver, browser_id, individual_stop_event)
        browser_instances.append(browser_instance)
        try:
            thread = Thread(
                target=monitor_webpage_until_change,
                args=(driver, browser_instance, url, key_strings, individual_stop_event),
            )
            thread.start()
        except Exception as e:
            print(f"Failed to open browser in {driver}: {e}")
            browser_instance.status = f"Error opening browser: {e}"

def update_browser_status_display():
    for browser_instance in browser_instances:
        if browser_instance.id not in browser_widgets:
            frame = tk.Frame(browser_status_frame)
            frame.pack(fill="x", pady=2)

            label_frame = tk.Frame(frame, width=400, height=20)
            label_frame.pack(side=tk.LEFT)
            label_frame.pack_propagate(False)

            label_text = f"Browser {browser_instance.id}: {browser_instance.status}"
            label = tk.Label(label_frame, text=label_text, anchor="w", justify="left", wraplength=390)
            label.pack(fill="both", expand=True)

            button_text = tk.StringVar()
            button_text.set("Stop Monitoring" if browser_instance.is_monitoring else "Start Monitoring")
            button = tk.Button(
                frame,
                textvariable=button_text,
                command=lambda bi=browser_instance, bt=button_text: toggle_monitoring(bi, bt),
            )
            button.pack(side=tk.RIGHT, padx=5)
            
            # Create a label to show "Clicked" next to the button, initially hidden
            clicked_label = tk.Label(frame, text="", fg="blue")
            clicked_label.pack(side=tk.RIGHT, padx=5)

            browser_widgets[browser_instance.id] = {
                "frame": frame,
                "label": label,
                "button": button,
                "button_text": button_text,
                "clicked_label": clicked_label,
            }
        else:
            label_text = f"Browser {browser_instance.id}: {browser_instance.status}"
            label = browser_widgets[browser_instance.id]["label"]
            label.config(text=label_text)

            button_text = browser_widgets[browser_instance.id]["button_text"]
            button_text.set("Stop Monitoring" if browser_instance.is_monitoring else "Start Monitoring")
            
             # Update "Clicked" label visibility
            clicked_label = browser_widgets[browser_instance.id]["clicked_label"]
            if browser_instance.clicked:
                clicked_label.config(text="Clicked")
            else:
                clicked_label.config(text="")

    root.after(1000, update_browser_status_display)

def toggle_monitoring(browser_instance, button_text):
    if browser_instance.is_monitoring:
        browser_instance.individual_stop_event.set()
        browser_instance.is_monitoring = False
        button_text.set("Start Monitoring")
        browser_instance.status = "Monitoring stopped by user."
    else:
        browser_instance.individual_stop_event.clear()
        browser_instance.is_monitoring = True
        button_text.set("Stop Monitoring")
        browser_instance.status = "Monitoring..."
        thread = Thread(
            target=monitor_webpage_until_change,
            args=(browser_instance.driver, browser_instance, browser_instance.driver.current_url, key_strings, browser_instance.individual_stop_event),
        )
        thread.start()
        
    # Show the "Clicked" label next to the button
    clicked_label = browser_widgets[browser_instance.id]["clicked_label"]
    clicked_label.config(text="Clicked")
    clicked_label.pack(side=tk.RIGHT, padx=5)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Monitor a webpage for a key string.")
    parser.add_argument("--url", default="https://glastonbury.seetickets.com/", help="The URL to monitor.")
    parser.add_argument("--key-strings", nargs='+', default=["postcode", "captcha"], help="The key string to search for in the webpage content.")
    parser.add_argument("--browsers", type=int, default=1, help="Number of browsers.")
    args = parser.parse_args()

    url_to_monitor = args.url
    key_strings = args.key_strings
    iterations = args.browsers

    root = tk.Tk()
    root.title("Webpage Monitoring Program")
    root.geometry("600x400")

    label = tk.Label(root, text="The program is running.\nClose this window to stop the program.")
    label.pack(pady=5)

    browser_status_frame = tk.Frame(root)
    browser_status_frame.pack(pady=5)

    open_in_browsers(url_to_monitor, iterations)

    update_browser_status_display()
    root.protocol("WM_DELETE_WINDOW", lambda: root.destroy())
    root.mainloop()
