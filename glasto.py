from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait

import time
from datetime import datetime, timezone, timedelta
import tkinter as tk
from threading import Thread, Event
from tkinter.font import Font
import argparse

import pygame  # Added for sound playback
import os
import sys

# Initialize pygame mixer
pygame.mixer.init()

# Use threading event for stopping the entire program
stop_refresh_event = Event()

# List to keep track of active drivers
active_drivers = []

# List to keep track of browser instances
browser_instances = []

browser_widgets = {}  # Dictionary to store widgets for each browser

# Initialize a counter for browser IDs
browser_id_counter = 1

# Load the sound file
sound_path = os.path.join(os.path.dirname(__file__), 'alert.wav')  # Ensure 'alert.wav' is in the same directory
if os.path.exists(sound_path):
    alert_sound = pygame.mixer.Sound(sound_path)
else:
    print("Alert sound file not found. Sound alerts will be disabled.")
    alert_sound = None

def setup_driver():
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")  # Recommended for some environments
    chrome_options.add_argument("--disable-gpu")  # Disable GPU for better compatibility
    chrome_options.add_argument("--disable-blink-features=AutomationControlled") 
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False) 
    chrome_options.add_experimental_option("detach", True) 

    # Set up ChromeDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    active_drivers.append(driver)  # Track the driver instance
    return driver

class BrowserInstance:
    def __init__(self, driver, id, individual_stop_event):
        self.driver = driver
        self.id = id
        self.status = 'Initializing'
        self.individual_stop_event = individual_stop_event
        self.is_refreshing = True  # Flag to track if the browser is refreshing
        self.key_string_found = False  # Flag to indicate if key string was found

def check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_string):
    try:
        # Use case-insensitive matching for 'Wednesday' buttons
        wednesday_buttons = driver.find_elements(By.XPATH, "//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'wednesday')]")
        
        if wednesday_buttons:
            # Check if the 'Wednesday' button contains 'Sold Out' or similar text
            wednesday_button_text = wednesday_buttons[0].text.lower()  # Convert to lowercase for easy matching
            if 'sold out' in wednesday_button_text or 'unavailable' in wednesday_button_text:
                # Case-insensitive search for 'Thursday' button
                thursday_buttons = driver.find_elements(By.XPATH, "//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'thursday')]")
                if thursday_buttons:
                    thursday_buttons[0].click()
                    print(f"'Wednesday' sold out, clicked 'Thursday' button in {driver}!")
                    browser_instance.status = "'Wednesday' sold out, clicked 'Thursday'"
                else:
                    print("No 'Thursday' button found.")
                    browser_instance.status = "No 'Thursday' button found"
            else:
                # If 'Wednesday' is available, click it
                wednesday_buttons[0].click()
                print(f"Clicked a 'Wednesday' button in {driver}!")
                browser_instance.status = "Clicked 'Wednesday' button"
        
        # Check for key_string in the page content
        current_content = driver.page_source
        if key_string in current_content:
            print(f"Key string found in {driver}!")
            browser_instance.status = "Key string found!"
            browser_instance.key_string_found = True

            # Display a visual alert in the browser
            try:
                driver.execute_script("""alert('Key string found! Attention!');""")
            except Exception as js_e:
                print(f"Error displaying alert in browser {driver}: {js_e}")

            # Play a sound via pygame (if available)
            if alert_sound:
                try:
                    alert_sound.play()
                except Exception as sound_e:
                    print(f"Error playing sound via pygame: {sound_e}")
            else:
                print("No alert sound configured.")

            return True  # Key string found, can stop monitoring
        else:
            browser_instance.status = f"'{key_string}' not found, continuing..."
            return False  # Continue monitoring
    except Exception as e:
        print(f"Error checking page in {driver}: {e}")
        browser_instance.status = f"Error: {e}"
        return False



def refresh_webpage_until_change(driver, browser_instance, url, key_string, refresh_delay, individual_stop_event=None):
    while not stop_refresh_event.is_set() and (individual_stop_event is None or not individual_stop_event.is_set()):
        try:
            driver.refresh()  # Refresh the current page
            browser_instance.status = 'Refreshing...'
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script('return document.readyState') == 'complete'
            )

            # Check the page for key_string and 'Wednesday' button
            if check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_string):
                if individual_stop_event:
                    individual_stop_event.set()
                break  # Key string found, exit loop

            # Monitor for redirects during refresh_delay interval
            current_url = driver.current_url
            start_time = time.time()
            while time.time() - start_time < refresh_delay:
                if driver.current_url != current_url:
                    # URL has changed, handle the redirect
                    current_url = driver.current_url
                    browser_instance.status = f"Redirected to {current_url}"
                    print(f"Redirect detected in {driver}. New URL: {current_url}")
                    WebDriverWait(driver, 10).until(
                        lambda d: d.execute_script('return document.readyState') == 'complete'
                    )
                    # Check the page again after redirect
                    if check_page_for_key_string_and_wednesday_button(driver, browser_instance, key_string):
                        if individual_stop_event:
                            individual_stop_event.set()
                        break  # Key string found, exit loop
                if stop_refresh_event.is_set() or (individual_stop_event and individual_stop_event.is_set()):
                    break
                time.sleep(0.1)  # Adjust the sleep interval as needed

        except Exception as e:
            print(f"Error during refresh in {driver}: {e}")
            browser_instance.status = f"Error: {e}"
            time.sleep(refresh_delay)
            
    browser_instance.is_refreshing = False
    if browser_instance.key_string_found:
        browser_instance.status = 'Key string found!'
        browser_widgets[browser_instance.id]['button_text'].set('Start Refresh')
    elif browser_instance.individual_stop_event.is_set():
        browser_instance.status = 'Refreshing stopped by user.'
        browser_widgets[browser_instance.id]['button_text'].set('Start Refresh')
    elif stop_refresh_event.is_set():
        browser_instance.status = 'Program stopped.'
    else:
        browser_instance.status = 'Refreshing stopped.'
        browser_widgets[browser_instance.id]['button_text'].set('Start Refresh')

def open_in_browsers(url, iterations, refresh_delay):
    global browser_id_counter
    for _ in range(iterations):
        driver = setup_driver()
        individual_stop_event = Event()  # Create a per-browser stop event
        browser_id = browser_id_counter
        browser_id_counter += 1
        browser_instance = BrowserInstance(driver, browser_id, individual_stop_event)
        browser_instances.append(browser_instance)
        try:
            driver.get(url)
            browser_instance.status = 'Running'
            print(f"Opened URL: {url} in {driver}")

            # Start the refresh loop in a regular thread (non-daemon)
            thread = Thread(target=refresh_webpage_until_change, args=(driver, browser_instance, url, key_string, refresh_delay, individual_stop_event))
            thread.start()
        except Exception as e:
            print(f"Failed to open browser in {driver}: {e}")
            browser_instance.status = f"Error opening browser: {e}"
            #driver.quit()

def check_time(url, key_string, iterations, refresh_delay):
    while not stop_refresh_event.is_set():  # Check if the program is still running
        current_time = get_gmt_time()
        past_targets = [target for target in TARGET_DATETIMES if target <= current_time]

        if past_targets:
            open_in_browsers(url, iterations, refresh_delay)  # Pass refresh_delay

            for target in past_targets:
                TARGET_DATETIMES.remove(target)
        time.sleep(0.05)

def get_gmt_time():
    return datetime.now(timezone.utc)

def update_countdown():
    while not stop_refresh_event.is_set():  # Check if the program is still running
        current_time = get_gmt_time()
        next_target = next(
            (target for target in TARGET_DATETIMES if target > current_time), None
        )
        if next_target:
            difference = next_target - current_time
            hours, remainder = divmod(difference.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            countdown_str.set(f"{difference.days}d {hours}h {minutes}m {seconds}s")
        else:
            countdown_str.set("All target times passed.")
        time.sleep(1)

def on_closing():
    stop_refresh_event.set()  # Stop all refresh loops
    root.destroy()
    # close_all_drivers()  # Close all active driver instances

def close_all_drivers():
    for driver in active_drivers:
        try:
            driver.quit()
        except Exception as e:
            print(f"Error closing driver {driver}: {e}")

def update_browser_status_display():
    for browser_instance in browser_instances:
        if browser_instance.id not in browser_widgets:
            # Create a frame for this browser
            frame = tk.Frame(browser_status_frame)
            frame.pack(fill='x', pady=2)
    
            # Create a fixed-width frame for the label
            label_frame = tk.Frame(frame, width=400, height=20)  # Set width as needed
            label_frame.pack(side=tk.LEFT)
            label_frame.pack_propagate(False)  # Prevent the frame from resizing based on its content
    
            # Create the label inside the fixed-width frame
            label_text = f"Browser {browser_instance.id}: {browser_instance.status}"
            label = tk.Label(label_frame, text=label_text, anchor='w', justify='left', wraplength=390)  # Adjust wraplength
            label.pack(fill='both', expand=True)
    
            # Create a button to stop/restart refreshing
            button_text = tk.StringVar()
            button_text.set('Stop Refresh' if browser_instance.is_refreshing else 'Start Refresh')
            button = tk.Button(
                frame,
                textvariable=button_text,
                command=lambda bi=browser_instance, bt=button_text: toggle_refresh(bi, bt)
            )
            button.pack(side=tk.RIGHT, padx=5)
    
            browser_widgets[browser_instance.id] = {
                'frame': frame,
                'label': label,
                'button': button,
                'button_text': button_text
            }
        else:
            # Update the existing label
            label_text = f"Browser {browser_instance.id}: {browser_instance.status}"
            label = browser_widgets[browser_instance.id]['label']
            label.config(text=label_text)
    
            # Update the button text
            button_text = browser_widgets[browser_instance.id]['button_text']
            button_text.set('Stop Refresh' if browser_instance.is_refreshing else 'Start Refresh')
    
    # Schedule the function to run again after 1 second
    root.after(1000, update_browser_status_display)


def toggle_refresh(browser_instance, button_text):
    if browser_instance.is_refreshing:
        # Stop refreshing
        browser_instance.individual_stop_event.set()
        browser_instance.is_refreshing = False
        button_text.set('Start Refresh')
        browser_instance.status = 'Refreshing stopped by user.'
    else:
        # Restart refreshing
        browser_instance.individual_stop_event.clear()
        browser_instance.is_refreshing = True
        browser_instance.key_string_found = False  # Reset the key string found flag
        button_text.set('Stop Refresh')
        browser_instance.status = 'Refreshing...'

        # Start the refresh loop again
        thread = Thread(target=refresh_webpage_until_change, args=(
            browser_instance.driver, browser_instance, browser_instance.driver.current_url,
            key_string, refresh_delay, browser_instance.individual_stop_event))
        thread.start()

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Monitor a webpage for a key string.")
    parser.add_argument("--url", default="http://localhost:8000/", help="The URL to monitor.")  # https://glastonbury.seetickets.com/
    parser.add_argument("--key-string", default="postcode", help="The key string to search for in the webpage content.")
    parser.add_argument("--refresh-delay", type=float, default=1, help="Delay in seconds between each webpage refresh.")
    parser.add_argument("--iterations", type=int, default=1, help="Number of iterations per browser.")
    parser.add_argument("--start-time", help="Start time in format 'YYYY-MM-DD HH:MM:SS' in UTC.")
    
    args = parser.parse_args()

    url_to_monitor = args.url
    key_string = args.key_string
    iterations = args.iterations
    refresh_delay = args.refresh_delay  # Assign to a variable

    # Set up the target datetime
    if args.start_time:
        try:
            start_time = datetime.strptime(args.start_time, '%Y-%m-%d %H:%M:%S')
            start_time = start_time.replace(tzinfo=timezone.utc)
            TARGET_DATETIMES = [start_time]
            print(start_time)
        except ValueError:
            print("Invalid start time format. Please use 'YYYY-MM-DD HH:MM:SS' format.")
            sys.exit(1)
    else:
        TARGET_DATETIMES = [datetime.now(timezone.utc) + timedelta(seconds=1)]

    root = tk.Tk()
    root.title("Running Glasto Program")
    root.geometry("600x400")

    label = tk.Label(
        root, text="The program is running.\nClose this window to stop the program."
    )
    label.pack(pady=5)

    countdown_str = tk.StringVar()
    countdown_font = Font(family="Arial", size=14, weight="bold")
    countdown_label = tk.Label(
        root, textvariable=countdown_str, font=countdown_font, fg="red"
    )
    countdown_label.pack(pady=5)

    # Frame to display browser statuses
    browser_labels = {}
    browser_status_frame = tk.Frame(root)
    browser_status_frame.pack(pady=5)

    # Define threads
    thread1 = Thread(target=check_time, args=(url_to_monitor, key_string, iterations, refresh_delay))
    thread2 = Thread(target=update_countdown)

    thread1.start()
    thread2.start()

    update_browser_status_display()  # Start updating the browser status display

    root.protocol("WM_DELETE_WINDOW", on_closing)  # Handle window closing event

    try:
        root.mainloop()
    except KeyboardInterrupt:
        print("Program interrupted by user.")
        pass  # Do nothing to keep browsers open
