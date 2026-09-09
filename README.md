[ReadMe.md](https://github.com/user-attachments/files/32015177/ReadMe.md)

# ReadMe

# 冷冻海产品溯源系统使用手册

后端仓库：https://github.com/PENG-7777/seafood-trace-parent.git
前端仓库：https://github.com/PENG-7777/seafood-trace-front.git

## 初始化数据库

数据库名：seafood_trace

文件：冷冻海产品溯源系统数据库.txt

## 启动后端

- 在application.yaml文件中修改数据库的字段 `username`  和 `password`
- 启动``admin`端和`node`端服务

![image-20260909180544651](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909180544651.png)

## 启动前端

![image-20260909180619565](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909180619565.png)

## 访问页面

- admin端

  - 访问路径：`http://localhost:5173/login`

  - 账号：`admin`

  - 密码：`123456`

- 流通节点端

  - 访问路径：`http://localhost:5173/node/login`

  - **链路：捕捞企业/养殖企业 → 冷冻加工企业 → 批发商 → 零售商**
  - 捕捞企业（编码 **`B00X`**，如 `B001`、 `B002` 、 `B003`、 `B004` ……）
  - 养殖企业（编码 **`Y00X`**，如 `Y001`、 `Y002` 、Y003`、 `Y004` ……）
  - 冷冻加工企业（编码  **`J00X`**，如 `J001`、 `J002` 、 `J003`、 `J004` ……）
  - 批发商（编码 **`P00X`**，如 `P001`、 `P002` 、 `P003`、 `P004` ……）
  - 零售商（编码 **`L00X`**，如 `L001`、 `L002` 、 `L003`、 `L004` ……）
  - 密码默认为：**`123456`**

- 客户端页面

  - 访问路径：`http://localhost:5173/customer/trace`

  ###  **admin端登录页**

  ![image-20260909180923255](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909180923255.png)

  ### **admin端首页**

  ![image-20260909180947786](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909180947786.png)

  ### **admin端新增节点**

  ![image-20260909181556989](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909181556989.png)

  ### **admin端节点详情**

  ![image-20260909181922649](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909181922649.png)

  ### **admin端编辑节点信息**

  ![image-20260909181948322](C:\Users\36549\AppData\Roaming\Typora\typora-user-images\image-20260909181948322.png)

  

  ### **流通节点登录页**

  ![image-20260909221033154](./ReadMe.assets/image-20260909221033154.png)

  ### **流通节点首页**

  其中捕捞企业/养殖企业 、冷冻加工企业 、批发商有“下游企业进场确认”选项，零售商没有

  ![image-20260909220929010](./ReadMe.assets/image-20260909220929010.png)

  ![image-20260909221339012](./ReadMe.assets/image-20260909221339012.png)

  ### **流通节点更改密码页面**

  ![image-20260909220948005](./ReadMe.assets/image-20260909220948005.png)

  ### **客户端查询首页**

  ![image-20260909215224919](./ReadMe.assets/image-20260909215224919.png)

  

  ### **溯源码查询详情页面**

  ![image-20260909220639083](./ReadMe.assets/image-20260909220639083.png)

  ### **捕捞企业**

  #### ①新增生产批号

  ![image-20260909221617055](./ReadMe.assets/image-20260909221617055.png)

  #### ②产品批号管理

  ![image-20260909221749912](./ReadMe.assets/image-20260909221749912.png)

  #### ③产品批号管理-更新

  ![image-20260909221830419](./ReadMe.assets/image-20260909221830419.png)

  #### ④产品批号管理-删除

  ![image-20260909221919988](./ReadMe.assets/image-20260909221919988.png)

  #### ⑤下游企业进场确认

  ![image-20260909223207911](./ReadMe.assets/image-20260909223207911.png)

  ### 养殖企业

  #### ①新建生产批号

  ![image-20260909231239428](./ReadMe.assets/image-20260909231239428.png)

  #### ②产品批号管理

  ![image-20260909231254411](./ReadMe.assets/image-20260909231254411.png)

  #### ③产品批号管理-更新

  ![image-20260909231306166](./ReadMe.assets/image-20260909231306166.png)

  #### ④产品批号管理-批号详情

  ![image-20260909231321843](./ReadMe.assets/image-20260909231321843.png)

  #### ⑤产品批号管理-删除

  ![image-20260909231335951](./ReadMe.assets/image-20260909231335951.png)

  #### ⑥发布产品批号

  ![image-20260909231351420](./ReadMe.assets/image-20260909231351420.png)

  #### ⑦下架产品批号

  ![image-20260909231405686](./ReadMe.assets/image-20260909231405686.png)

  ### 冷冻加工企业

  #### ①新建生产批号

  ![image-20260909222531212](./ReadMe.assets/image-20260909222531212.png)

  #### ②产品批号管理

  ![image-20260909222657851](./ReadMe.assets/image-20260909222657851.png)

  #### ③产品批号管理-更新

  ![image-20260909222754127](./ReadMe.assets/image-20260909222754127.png)

  #### ④产品批号管理-批号详情

  ![image-20260909222843861](./ReadMe.assets/image-20260909222843861.png)

  #### ⑤产品批号管理-删除

  ![image-20260909222936764](./ReadMe.assets/image-20260909222936764.png)

  #### ⑥发布产品批号

  ![image-20260909223008040](./ReadMe.assets/image-20260909223008040.png)

  #### ⑦下架产品批号

  ![image-20260909223054164](./ReadMe.assets/image-20260909223054164.png)

  #### ⑧下游企业进场确认

  ![image-20260909224009499](./ReadMe.assets/image-20260909224009499.png)

  ### **批发商**

  #### ①新建生产批号

  ![image-20260909223811553](./ReadMe.assets/image-20260909223811553.png)

  #### ②产品批号管理

  ![image-20260909223828300](./ReadMe.assets/image-20260909223828300.png)

  #### ③产品批号管理-更新

  ![image-20260909223843275](./ReadMe.assets/image-20260909223843275.png)

  #### ④产品批号管理-批号详情

  ![image-20260909223859276](./ReadMe.assets/image-20260909223859276.png)

  #### ⑤产品批号管理-删除

  ![image-20260909223910491](./ReadMe.assets/image-20260909223910491.png)

  #### ⑥发布产品批号

  ![image-20260909223923756](./ReadMe.assets/image-20260909223923756.png)

  #### ⑦下架产品批号

  ![image-20260909223941833](./ReadMe.assets/image-20260909223941833.png)

  #### ⑧下游企业进场确认

  ![image-20260909224835033](./ReadMe.assets/image-20260909224835033.png)

  ### 零售商

  #### ①新增生产批号

  ![image-20260909224426879](./ReadMe.assets/image-20260909224426879.png)

  #### ②产品批号管理

  ![image-20260909224442996](./ReadMe.assets/image-20260909224442996.png)

  #### ③产品批号管理-更新

  ![image-20260909224502087](./ReadMe.assets/image-20260909224502087.png)

  #### ④产品批号管理-批号详情

  ![image-20260909224520763](./ReadMe.assets/image-20260909224520763.png)

  #### ⑤产品批号管理-删除

  ![image-20260909224534162](./ReadMe.assets/image-20260909224534162.png)

  #### ⑥发布产品批号

  ![image-20260909224546628](./ReadMe.assets/image-20260909224546628.png)

  #### ⑦下架产品批号

  ![image-20260909224606149](./ReadMe.assets/image-20260909224606149.png)

  #### ⑧查看已确认上架批号溯源码详情

  ![image-20260909224725417](./ReadMe.assets/image-20260909224725417.png)









