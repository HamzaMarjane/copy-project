import React from 'react'
import { Card, Avatar } from 'antd'

interface Member {
  id: string
  name: string | null
  avatar: string | null
}

interface MemberCardProps {
  member: Member
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <Card hoverable>
      <Card.Meta
        avatar={<Avatar src={member.avatar} />}
        title={member.name}
      />
    </Card>
  )
}

export default MemberCard