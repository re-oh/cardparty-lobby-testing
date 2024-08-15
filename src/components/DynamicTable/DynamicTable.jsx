import { useState } from "react";
import "./dynamicTable.scss";

const DynamicTable = (props) => {
  const { dynTables, setDynTables } = props;

  // Function to handle adding a new table
  const handleAddTable = () => {
    const newTable = {
      name: "New Table",
      values: [],
    };
    setDynTables([...dynTables, newTable]);
  };

  // Function to handle deleting a table
  const handleDeleteTable = (index) => {
    const newTables = dynTables.filter((_, i) => i !== index);
    setDynTables(newTables);
  };

  // Function to handle updating a table name
  const handleUpdateTableName = (index, newName) => {
    const updatedTables = [...dynTables];
    // Ensure unique name
    if (dynTables.some((table, i) => table.name === newName && i !== index)) {
      updatedTables[index].name = "Dynamic Table Names should be unique!";
    } else {
      updatedTables[index].name = newName;
    }
    setDynTables(updatedTables);
  };

  // Function to handle adding a new value
  const handleAddValue = (tableIndex) => {
    const updatedTables = [...dynTables];
    updatedTables[tableIndex].values.push({ value: "", tags: [] });
    setDynTables(updatedTables);
  };

  // Function to handle updating a value
  const handleUpdateValue = (tableIndex, valueIndex, newValue) => {
    const updatedTables = [...dynTables];
    const values = updatedTables[tableIndex].values;

    // Ensure unique value
    if (values.some((v, i) => v.value === newValue && i !== valueIndex)) {
      values[valueIndex].value = "Duplicate value!";
    } else {
      values[valueIndex].value = newValue;
    }

    setDynTables(updatedTables);
  };

  // Function to handle deleting a value
  const handleDeleteValue = (tableIndex, valueIndex) => {
    const updatedTables = [...dynTables];
    updatedTables[tableIndex].values = updatedTables[tableIndex].values.filter(
      (_, i) => i !== valueIndex
    );
    setDynTables(updatedTables);
  };

  // Function to handle adding a new tag
  const handleAddTag = (tableIndex, valueIndex) => {
    const updatedTables = [...dynTables];
    updatedTables[tableIndex].values[valueIndex].tags.push("");
    setDynTables(updatedTables);
  };

  // Function to handle updating a tag
  const handleUpdateTag = (tableIndex, valueIndex, tagIndex, newTag) => {
    const updatedTables = [...dynTables];
    const tags = updatedTables[tableIndex].values[valueIndex].tags;

    // Ensure unique tag
    if (tags.some((tag, i) => tag === newTag && i !== tagIndex)) {
      tags[tagIndex] = "Duplicate tag!";
    } else {
      tags[tagIndex] = newTag;
    }

    setDynTables(updatedTables);
  };

  // Function to handle deleting a tag
  const handleDeleteTag = (tableIndex, valueIndex, tagIndex) => {
    const updatedTables = [...dynTables];
    const tags = updatedTables[tableIndex].values[valueIndex].tags.filter(
      (_, i) => i !== tagIndex
    );
    updatedTables[tableIndex].values[valueIndex].tags = tags;
    setDynTables(updatedTables);
  };

  return (
    <div className="DynamicTable">
      <button onClick={handleAddTable}>Add New Table</button>
      {dynTables.map((dynTable, tableIndex) => (
        <div className="dyntable-container" key={tableIndex}>
          <input
            type="text"
            value={dynTable.name}
            onChange={(e) => handleUpdateTableName(tableIndex, e.target.value)}
            className="dyntable-name-input"
          />
          <button onClick={() => handleDeleteTable(tableIndex)}>x</button>
          <ul>
            {dynTable.values.map((value, valueIndex) => (
              <li className="value" key={valueIndex}>
                <input
                  type="text"
                  value={value.value}
                  onChange={(e) =>
                    handleUpdateValue(tableIndex, valueIndex, e.target.value)
                  }
                />
                <button
                  onClick={() => handleDeleteValue(tableIndex, valueIndex)}
                  className="red x-button"
                >
                  x
                </button>
                <ul className="tags">
                  {value.tags.map((tag, tagIndex) => (
                    <li key={tagIndex}>
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) =>
                          handleUpdateTag(
                            tableIndex,
                            valueIndex,
                            tagIndex,
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleDeleteTag(tableIndex, valueIndex, tagIndex)
                        }
                        className="red x-button"
                      >
                        x
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => handleAddTag(tableIndex, valueIndex)}
                    >
                      Add Tag +
                    </button>
                  </li>
                </ul>
              </li>
            ))}
            <li>
              <button onClick={() => handleAddValue(tableIndex)}>
                Add Value +
              </button>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DynamicTable;
