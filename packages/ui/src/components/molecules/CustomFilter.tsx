"use client";
import { Space, DatePicker, Select } from "antd";
import dayjs from 'dayjs';
import TagSelector from '../atoms/TagSelector';  // Import the new TagSelector component
import { Tag } from "../../utils/types";

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Filters {
    date_start: string | undefined;
    date_end: string | undefined;
    order: string | undefined;
    tags: Tag[];
    title: string | undefined;
    city: string | undefined;
}

interface CustomFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

const CustomFilter: React.FC<CustomFiltersProps> = ({
    filters,
    setFilters,
}) => {
    const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        setFilters({
            ...filters,
            date_start: dates?.[0]?.toISOString() || undefined,
            date_end: dates?.[1]?.toISOString() || undefined,
        });
    };

    const handleOrderChange = (value: string) => {
        setFilters({
            ...filters,
            order: value,
        });
    };

    const handleTagChange = (tags: Tag[]) => {
        setFilters({
            ...filters,
            tags: tags,
        });
    };

    return (
        <Space style={{ backgroundColor: '#FFF9D0', padding: '1em', marginTop: '1em', width: '100%' }}>
            <RangePicker
                showTime
                value={[
                    filters.date_start ? dayjs(filters.date_start) : null,
                    filters.date_end ? dayjs(filters.date_end) : null
                ]}
                onChange={handleDateChange}
            />
            <Select
                value={filters.order}
                onChange={handleOrderChange}
                style={{ width: 200 }}
            >
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
            </Select>

            <TagSelector
                selectedTags={filters.tags}
                onTagChange={handleTagChange}
            />
        </Space>
    );
};

export default CustomFilter;