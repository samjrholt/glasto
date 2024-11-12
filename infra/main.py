import os
from linode_api4 import LinodeClient


def main():
    client = LinodeClient(token=os.getenv('LINODE_TOKEN'))
    for i in range(1):
        server_id = i+1
        print(f'Creating server {server_id}')
        new_linode = client.linode.instance_create(
            ltype="g6-standard-2",
            region="gb-lon",
            image="linode/ubuntu24.04",
            label=f"ubuntu-{server_id}",
            root_pass="footnote-polygon-remake",
            # metadata={
            #     "user_data": "IyEvYmluL2Jhc2gKc3VkbyBhcHQgdXBkYXRlICYmIHN1ZG8gYXB0IHVwZ3JhZGUKc3VkbyBhcHQgaW5zdGFsbCB4ZmNlNCB4ZmNlNC1nb29kaWVzIGRidXMteDExIGZpcmVmb3gtZXNyIApzdWRvIGluc3RhbGwgbGlnaHRkbQpzdWRvIGRwa2ctcmVjb25maWd1cmUgbGlnaHRkbQpzdWRvIHN5c3RlbWN0bCBzdGFydCBsaWdodGRtYQ==",
            # },
            authorized_users=["safel"]
        )


if __name__ == '__main__':
    main()