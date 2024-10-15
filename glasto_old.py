import webbrowser
import time
import requests
from datetime import datetime, timezone, timedelta
import tkinter as tk
from threading import Thread, Event
from tkinter.font import Font
import argparse

# Use threading event for stopping the refresh
stop_refresh_event = Event()

def open_in_browsers(url, iterations):
    browsers = ["google-chrome", "firefox", "safari", "opera"]

    # Open the URL in specified number of tabs for each browser, if available
    for browser in browsers:
        for _ in range(iterations):
            try:
                webbrowser.get(browser).open_new(url)  # Open one tab per browser instance
            except webbrowser.Error:
                print(f"Failed to open browser: {browser}")

def get_gmt_time():
    return datetime.now(timezone.utc)

def refresh_webpage_until_change(url, key_string, requests_get=requests.get):
    # Use a session for persistent connections
    session = requests.Session()

    # Add headers to prevent caching
    headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }

    while not stop_refresh_event.is_set():  # Check if refreshing is allowed
        try:
            # Fetch the content of the webpage with headers to avoid cache
            response = session.get(url, headers=headers)
            current_content = response.text

            if key_string in current_content:
                print("Key string found in the webpage content!")
                stop_refresh_event.set()  # Stop refreshing
                break  # Exit loop when key string is found
            else:
                print("Key string not found, refreshing...")

            time.sleep(1.1)  # Wait 1.1 seconds before refreshing
        except requests.RequestException as e:
            print(f"Error checking webpage content: {e}")
            time.sleep(1.1)  # In case of error, wait and try again

def check_time(url, key_string, iterations):
    while not stop_refresh_event.is_set():  # Check if the program is still running
        current_time = get_gmt_time()
        past_targets = [target for target in TARGET_DATETIMES if target <= current_time]

        if past_targets:
            open_in_browsers(url, iterations)  # Open instances per browser

            # After opening, start checking and refreshing the page every 1.1 seconds
            for _ in range(5):  # Adjust as needed
                Thread(target=refresh_webpage_until_change, args=(url, key_string, requests.get)).start()

            for target in past_targets:
                TARGET_DATETIMES.remove(target)
        time.sleep(0.05)

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
    stop_refresh_event.set()  # Stop the refresh event
    root.destroy()

if __name__ == "__main__":    
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Monitor a webpage for a key string.")
    parser.add_argument("--url", default="https://glastonbury.seetickets.com/", help="The URL to monitor.")
    parser.add_argument("--key-string", default="Your Key String Here", help="The key string to search for in the webpage content.")
    parser.add_argument("--delay", type=float, default=1, help="Delay in seconds before starting the monitoring.")
    parser.add_argument("--iterations", type=int, default=1, help="Number of iterations per browser.")
    args = parser.parse_args()

    url_to_monitor = args.url
    key_string = args.key_string
    iterations = args.iterations

    # Set up the target datetime
    TARGET_DATETIMES = sorted(
        [
            datetime.now(timezone.utc) + timedelta(seconds=args.delay)
        ]
    )

    root = tk.Tk()
    root.title("Running Glasto Program")
    root.geometry("500x140")

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

    # Define a flag to control the threads
    thread1 = Thread(target=check_time, args=(url_to_monitor, key_string, iterations))
    thread2 = Thread(target=update_countdown)

    thread1.start()
    thread2.start()

    root.protocol("WM_DELETE_WINDOW", on_closing)  # Handle window closing event

    root.mainloop()
