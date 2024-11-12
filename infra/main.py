import os
from linode_api4 import LinodeClient
import base64


def get_userdata_encoded():
    with open('infra/userdata.sh', 'r') as f:
        userdata = f.read()
    with open('infra/env', 'r') as f:
        envdata = f.read()
    userdata = userdata.replace('TAILSCALE_AUTH_KEY_PLACEHOLDER', envdata)
    encoded = base64.b64encode(userdata.encode('utf-8'))
    return encoded.decode('utf-8')


def main():
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    userdata = get_userdata_encoded()
    for i in range(1):
        server_id = i+1
        print(f'Creating server {server_id}')
        new_linode = client.linode.instance_create(
            ltype="g6-standard-2",
            region="gb-lon",
            image="linode/ubuntu24.04",
            label=f"ubuntu-{server_id}",
            root_pass=os.getenv('LINODE_ROOT_PASS'),
            metadata={
                "user_data": userdata
            },
            authorized_users=["safel"]
        )


if __name__ == '__main__':
    print("You must pass LINODE_ROOT_PASS in order to run this script.")
    main()