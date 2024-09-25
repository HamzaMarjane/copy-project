import SignupForm from "@ntla9aw/ui/src/components/molecules/SignupForm";
import { Space } from "antd";

export default function Settings() {
  return (
    <Space
      style={{
        background: "white",
        width: "100%",
        padding: "1em",
      }}
      direction="vertical"
    >
      <SignupForm title={"Profile Settings"} />
      <SignupForm title={"Community Settings"} />
    </Space>
  );
}
