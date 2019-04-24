import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { useEffect, useState } from "react";
import Link from "next/link";
// import _ from "lodash";
import axios from "axios";
import { Button } from "antd";

interface IInfo {
  uuid: string;
}

interface IDB {
  name: string;
  info: IInfo;
}

const PostLink = ({ name }) => (
  <li>
    <Link href={{ pathname: "/tables", query: { name } }}>
      <a>{name}</a>
    </Link>
  </li>
);

export default function db() {
  const [dbs, setDbs] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/db/get").then((res: any) => {
      setDbs(res.data.data);
    });
  }, []);

  function handleCreate() {
    // Modal({
    //   title: "请输入新表格名称",
    //   content: <Input />,
    //   okText: "确认",
    //   cancelText: "取消",
    //   onOk: (data) => {
    //     console.log(data);
    //   }
    // });
  }

  return (
    <div>
      <h1>数据库连接表</h1>
      <Button onClick={() => handleCreate()} type="primary">
        创建新表
      </Button>
      <h3>数据库所有表</h3>
      <div className="container">
        {dbs.map((db: IDB) => (
          <PostLink name={db.name} key={db.info.uuid} />
        ))}
      </div>
    </div>
  );
}
