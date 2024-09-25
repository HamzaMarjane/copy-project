import React, { useState, useEffect } from 'react';
import { Tag as AntTag, AutoComplete } from 'antd';
import { trpcStatic } from "@ntla9aw/trpc-client/src/static";
import { Tag } from '../../utils/types';

interface TagSelectorProps {
  selectedTags: Tag[];
  onTagChange: (tags: Tag[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagChange }) => {
  const [tagOptions, setTagOptions] = useState<Tag[]>([]);
  const [searchedTag, setSearchedTag] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const tagsData = await trpcStatic.navigation.tags.query();
      if (tagsData) {
        setTagOptions(tagsData);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tag: Tag) => {
    const updatedTags = selectedTags.some(t => t.tag_id === tag.tag_id)
      ? selectedTags.filter((t) => t.tag_id !== tag.tag_id)
      : [...selectedTags, tag];
    onTagChange(updatedTags);
  };

  const handleTagSearch = (value: string) => {
    setSearchedTag(value);
    const filteredOptions = tagOptions.filter(tag =>
      tag.name.toLowerCase().includes(value.toLowerCase())
    );
    setTagOptions(filteredOptions);
  };

  const handleTagSelect = (value: string) => {
    const selectedTag = tagOptions.find(tag => tag.name === value);
    if (selectedTag) {
      handleTagChange(selectedTag);
    }
    setSearchedTag('');
  };

  return (
    <div>
      {selectedTags.map((tag) => (
        <AntTag
          key={tag.tag_id}
          closable
          onClose={() => handleTagChange(tag)}
          style={{ marginRight: 8 }}
        >
          {tag.name}
        </AntTag>
      ))}

      <AutoComplete
        options={tagOptions.map(tag => ({ value: tag.name }))}
        style={{ width: 200 }}
        placeholder="Add tag"
        value={searchedTag}
        onChange={setSearchedTag}
        onSearch={handleTagSearch}
        onSelect={handleTagSelect}
      />
    </div>
  );
};

export default TagSelector;