# Glasto!

Script to try and get glasto tickets!
This repo contains both the script and a test website `test_site/` (which has its own README.md).
This script monitors a specified webpage for a particular key string and interacts with the page by clicking on specific elements.
e.g. like clicking the 'Wednesday' button for coaches.
It provides real-time updates via a Tkinter GUI and handles browser instances using Selenium WebDriver.

**CLOSING THE TKINTER WINDOW CLOSES ALL LINKED BROWSERS**


## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Using Conda to Create the Environment](#using-conda-to-create-the-environment)
- [Usage](#usage)
  - [Command-Line Arguments](#command-line-arguments)
  - [Examples](#examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- Automated browser monitoring with Selenium WebDriver.
- Key string detection in webpage content.
- Interaction with webpage elements (e.g., clicking buttons).
- Redirect handling during monitoring.
- Real-time status updates in a Tkinter GUI.
- Visual and sound alerts upon key string detection.
- Customizable via command-line arguments.

## Prerequisites

- **Conda**: Anaconda or Miniconda installed.
- **Google Chrome Browser**: Required for ChromeDriver.
- **Python Modules**: Installed within the conda environment as described below.

## Installation

### Using Conda to Create the Environment

1. **Install Anaconda or Miniconda**

   Download and install [Anaconda](https://www.anaconda.com/products/individual) or [Miniconda](https://docs.conda.io/en/latest/miniconda.html).

2. **Create a New Conda Environment**

   Create a new environment named `glasto` with Python 3.12:

   ```bash
   conda create -n glasto python=3.12 pip
   ```

3. **Activate the Environment**

   Activate the environment:

   ```bash
   conda activate glasto
   ```

4. **Install Required Packages**

   Install packages using pip:

   ```bash
   pip install -r requirements.txt
   ```

## Testing
Start the test website server (see README in `test_site/`)

```bash
python glasto.py
```

## Usage

Try to run the script using Python from the command line. (and install all the packages i forgot to include above)
Customize its behavior using command-line arguments.

```bash
python glasto.py [options]
```

### Command-Line Arguments

- `--url`: The URL of the webpage to monitor (default: `http://localhost:8000/`).
- `--key-string`: The key string to search for (default: `postcode`).
- `--refresh-delay`: Delay in seconds between each refresh (default: `1`).
- `--browsers`: Number of browser instances to open (default: `1`).
- `--start-time"`: Start time in format 'YYYY-MM-DD HH:MM:SS' in UTC. (defaults to 1 second from now).

### Examples

1. **Monitor a Specific Webpage**

   ```bash
   python glasto.py --url "https://glastonbury.seetickets.com/" --key-string "postcode" --browsers 5
   ```

2. **Customize Refresh Delay**

   ```bash
   python glasto.py --refresh-delay 2.0
   ```


## Configuration

- **Alert Sound**

  Place an `alert.wav` file in the script directory to enable sound alerts.

- **Browser Options**

  Modify the `setup_driver()` function in the script to change browser options or use a different browser.