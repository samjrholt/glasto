#!/bin/bash
sudo apt update && sudo apt upgrade
sudo apt install xfce4 xfce4-goodies dbus-x11 -y
# setup xrdp
sudo apt install xrdp -y
sudo adduser xrdp ssl-cert
echo "xfce4-session" > ~/.xsession
sudo systemctl restart xrdp
sudo systemctl enable xrdp
sudo ufw allow 3389/tcp

# Tailscale
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/noble.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/noble.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt-get update
sudo apt-get install tailscale -y
sudo tailscale up --hostname=SERVER_NAME_PLACEHOLDER --auth-key=TAILSCALE_AUTH_KEY_PLACEHOLDER
tailscale ip -4
# Setup ifconfig
apt install net-tools

sudo mkdir /root/Desktop

# setup chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb -y
# Create a script to open Google Chrome with --no-sandbox flag
cat <<EOF > /root/Desktop/open-chrome.sh
#!/bin/bash
google-chrome --no-sandbox --disable-gpu
EOF
# Make the chrome script executable
chmod +x /root/Desktop/open-chrome.sh

# Setup brave browser
sudo apt install curl -y
sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg] https://brave-browser-apt-release.s3.brave.com/ stable main"| sudo tee /etc/apt/sources.list.d/brave-browser-release.list
sudo apt update
sudo apt install brave-browser -y
# Create a script to open brave with --no-sandbox flag
cat <<EOF > /root/Desktop/open-brave.sh
#!/bin/bash
brave-browser --no-sandbox --disable-gpu
EOF
# Make the chrome script executable
chmod +x /root/Desktop/open-brave.sh

# Setup Firefox browser
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null
gpg -n -q --import --import-options import-show /etc/apt/keyrings/packages.mozilla.org.asc | awk '/pub/{getline; gsub(/^ +| +$/,""); if($0 == "35BAA0B33E9EB396F59CA838C0BA5CE6DC6315A3") print "\nThe key fingerprint matches ("$0").\n"; else print "\nVerification failed: the fingerprint ("$0") does not match the expected one.\n"}'
echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
echo '
Package: *
Pin: origin packages.mozilla.org
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla
sudo apt-get update && sudo apt-get install firefox -y
# Create a script to open firefox with --no-sandbox flag
cat <<EOF > /root/Desktop/open-firefox.sh
#!/bin/bash
firefox
EOF
# Make the chrome script executable
chmod +x /root/Desktop/open-firefox.sh

# setup conda
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh
source ~/miniconda3/bin/activate
conda init --all
# Pull repo
cd ~/
git clone https://github.com/samjrholt/glasto.git
cd glasto
conda create -n glasto python=3.12 pip
conda activate glasto
pip install -r requirements.txt

# Add glasto_conda to bashrc
echo "conda activate glasto" >> ~/.bashrc

# Add glasto terminal shortcut on desktop
cat <<EOF > /root/Desktop/glasto-terminal.sh
#!/bin/bash
cd ~/glasto
xfce4-terminal
EOF
# Make the script executable
chmod +x /root/Desktop/glasto-terminal.sh

# Setup exit node as final command incase it knocks the outbound network out
sudo tailscale set --exit-node=TAILSCALE_EXIT_NODE_PLACEHOLDER