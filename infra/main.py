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


def create_servers(server_count: int = 1, current_server_ids: list = list):
    if not os.getenv('LINODE_ROOT_PASS'):
        raise KeyError("You must pass LINODE_ROOT_PASS in order to run this script.")
    print(f"Creating {server_count} servers...")
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    for server_id in range(1, server_count+1):
        server_name = f"glasto-box-{server_id}"
        if server_id in current_server_ids:
            print(f'Server `{server_name}` already exists. If you want to replace it, manually delete it first. Skipping...')
            continue
        userdata = get_userdata_encoded(server_id)
        print(f'Creating server `{server_name}')
        new_linode = client.linode.instance_create(
            ltype="g6-standard-4",
            region="gb-lon",
            image="linode/ubuntu24.04",
            label=server_name,
            root_pass=os.getenv('LINODE_ROOT_PASS'),
            metadata={
                "user_data": userdata
            },
        )


def list_servers():
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    servers = client.linode.instances()
    server_ids = []

    print("Listing all servers...")
    for s in servers:
        match = re.search(r"glasto-box-(\d+)", s.label)
        if match:
            print(s.label, s.ips.ipv4.public[0].address)
            server_ids.append(int(match.group(1)))
    return server_ids


if __name__ == '__main__':
    server_count = 4

    server_ids = list_servers()
    create_servers(server_count, server_ids)

    list_servers()