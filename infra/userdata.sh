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
sudo tailscale up --auth-key=TAILSCALE_AUTH_KEY_PLACEHOLDER
tailscale ip -4
# setup chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
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
