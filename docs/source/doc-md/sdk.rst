
Javascript
==========

san-sdk Javascript SDK 简介
----------------------------

san-sdk Javascript SDK 提供了一整套对 区块链、分布式存储 进行管理操作的 Javascript 库。 目前，SDK 支持密钥管理、区块链交互、分布式存储交互。

接口能力
---------

================== =============================== ==============================================
接口类型            接口名称                          接口能力概述
================== =============================== ==============================================
   密钥管理            密钥生成                          创建 sm2 密钥对

                     非对称加密                       sm2 公钥对数据加密、对应私钥对密文解密

                     签名及验签                        sm2 私钥对数据签名、公钥验签

   区块链交互          基本配置                          配置操作账户、主网节点地址

                     transact                         依托智能合约,发起创建账户等交易

                     get_account                      获取账户信息

                     history_get_key_accounts         获取key对应账户 

                     history_get_actions              获取账户历史操作

                     get_table_rows                   获取合约对应的表数据

                     get_info                         获取网络信息

                     getCodeHash                      获取智能合约code hash

                     get_abi                          获取智能合约 abi

                     get_raw_code_and_abi             获取智能合约 code 和 abi

                     get_block                        获取区块

                     get_block_header_state           获取验证交易头所需的最小状态

                     history_get_transaction          获取交易信息

   分布式存储       new Client                       创建与 icfs 交互的客户端
                    
                    操作                             add、get、cat 文件
================== =============================== ==============================================
                   
快速入门
---------

安装
^^^^^^^

**使用 yarn 进行安装** 

.. code:: bash

   yarn add san-sdk.js

接口说明
----------

.. toctree::
   :maxdepth: 3

   sdk/javascript/crypto.md
   sdk/javascript/blockchain.md
   sdk/javascript/icfs.md
   sdk/javascript/cluster.md
