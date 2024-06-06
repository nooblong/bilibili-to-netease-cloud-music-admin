import { ReactElement } from "react";

export interface NetAccount {
  id: string;
  userName: string;
  userId: string;
  nickname: string;
  signature: string;
}

export default UserInfoShow;

function UserInfoShow(netAccount: NetAccount): ReactElement {
  return (
    <div>
        id: {netAccount.id}
        <br />
        username: {netAccount.userName}
        <br />
        nickname: {netAccount.nickname}
        <br />
        signature: {netAccount.signature}
        <br />
    </div>
  );
}
