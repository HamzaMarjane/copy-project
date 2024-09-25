import React, { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TablePaginationConfig } from "antd";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Ticket } from "../../utils/types";
import dayjs from 'dayjs';

type DataIndex = keyof Ticket | 'user.name' | 'event.title';

interface TicketTableProps {
  data: Ticket[];
  onUpdate?: (ticket: Ticket) => void;
  onDelete?: (ticket_id: string) => void;
  pagination: TablePaginationConfig;
}

const TicketTable: React.FC<TicketTableProps> = ({ data, onUpdate, onDelete, pagination }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  
  const getColumnSearchProps = (dataIndex: DataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: unknown, record: Ticket) => {
      const filterValue = value as string;
      if (dataIndex === 'user.name') {
        return record.user.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
      }
      if (dataIndex === 'event.title') {
        return record.event.title.toLowerCase().includes(filterValue.toLowerCase());
      }
      return record[dataIndex as keyof Ticket]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase()) ?? false;
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<Ticket> = [
    {
      title: "User Name",
      dataIndex: ['user', 'name'],
      key: 'user.name',
      ...getColumnSearchProps('user.name'),
      render: (name: string | null) => name || 'N/A',
    },
    {
      title: "Event Title",
      dataIndex: ['event', 'title'],
      key: 'event.title',
      ...getColumnSearchProps('event.title'),
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      key: "purchase_date",
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: Ticket, b: Ticket) => dayjs(a.purchase_date).unix() - dayjs(b.purchase_date).unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          {onUpdate && (
            <Button type="primary" onClick={() => onUpdate(record)}>
              <EditOutlined />
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Are you sure to delete this Ticket?"
              onConfirm={() => onDelete(record.ticket_id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      rowKey="ticket_id" 
      pagination={pagination}
    />
  );
};

export default TicketTable;