import os
from linode_api4 import LinodeClient
from dotenv import load_dotenv
import base64
import re

load_dotenv()

EXIT_NODES = [
    '100.92.195.112', # k-aspire-f5-573g Kurts Plex
    #'100.82.8.49', # kl5 Kurts Laptop
    '100.103.233.72', # turner-air Michaels Pi
    '100.69.125.80', # google-pixel-7-pro Jacobs Pixel
    '100.106.242.96', # google-pixel-8 Jacks Pixel
    '100.74.85.30', # neplus-cph2609 Kurts phone?
]

def get_userdata_encoded(server_id: int):
    with open('infra/userdata.sh', 'r') as f:
        userdata = f.read()
    userdata = userdata.replace('TAILSCALE_AUTH_KEY_PLACEHOLDER', os.getenv('TAILSCALE_AUTH_KEY'))
    userdata = userdata.replace('SERVER_NAME_PLACEHOLDER', f"glasto-box-{server_id}")
    userdata = userdata.replace('TAILSCALE_EXIT_NODE_PLACEHOLDER', EXIT_NODES[server_id%len(EXIT_NODES)])
    encoded = base64.b64encode(userdata.encode('utf-8'))
    return encoded.decode('utf-8')


def create_servers(server_count: int = 1, current_server_ids: list = None):
    if current_server_ids is None:
        current_server_ids = []
    if not os.getenv('LINODE_ROOT_PASS'):
        raise KeyError("You must pass LINODE_ROOT_PASS in order to run this script.")
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    for _ in range(server_count):
        server_id = 1
        # Increment server_id until we find a unique one
        while server_id in current_server_ids:
            server_id += 1
        userdata = get_userdata_encoded(server_id)
        print(f'Creating server with unique ID {server_id}')
        new_linode = client.linode.instance_create(
            ltype="g6-standard-2",
            region="gb-lon",
            image="linode/ubuntu24.04",
            label=f"glasto-box-{server_id}",
            root_pass=os.getenv('LINODE_ROOT_PASS'),
            metadata={
                "user_data": userdata
            },
        )


def list_servers():
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    servers = client.linode.instances()
    server_ids = []
    
    for s in servers:
        match = re.search(r"glasto-box-(\d+)", s.label)
        if match:
            print(s.label, s.ips.ipv4.public[0].address)
            server_ids.append(int(match.group(1)))
    return server_ids


if __name__ == '__main__':
    server_count = 1

    server_ids = list_servers()
    create_servers(server_count, server_ids)

    list_servers()