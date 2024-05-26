import { useEffect, useState } from "react";
import { Check, File, Folder, Pencil, Plus, Trash2 } from "lucide-react";

import { IFolderData } from "../types/index";
import { useAppDispatch } from "../hooks/redux";
import { addItem, deleteItem, editItem } from "../features/folder/folderSlice";

interface FolderTreeProps {
  data: IFolderData;
  expanded?: boolean;
  prevPath?: string[];
}

function FolderTree({ data, expanded, prevPath = [] }: FolderTreeProps) {
  const [expand, setExpand] = useState(false);
  const dispatch = useAppDispatch();

  const [edit, setEdit] = useState({
    editMode: false,
    name: data.name,
    invalid: false,
  });

  const [add, setAdd] = useState({
    addMode: false,
    name: "",
    invalid: false,
  });

  const currentPath = [...prevPath, data.name];
  const isFolder = !data.name.includes(".");

  const handleExpand = () => !edit.editMode && setExpand(!expand);
  useEffect(() => {
    !expanded && setExpand(false);
  }, [expanded]);

  const expandStyle: React.CSSProperties = {
    transform: expand ? "translateY(0)" : "translateY(-10px)",
    opacity: expand ? "1" : "0",
    pointerEvents: expand ? "auto" : "none",
    maxHeight: expand ? "1000px" : "0",
  };

  const handleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdit({ ...edit, editMode: !edit.editMode });
  };

  const handleEdit = () => {
    const trimmedName = edit.name.trim();
    if (trimmedName.length === 0) {
      setEdit({ ...edit, invalid: true });
      setTimeout(() => {
        setEdit({ ...edit, invalid: false });
      }, 2500);
      return;
    }

    setEdit({ ...edit, editMode: false });
    dispatch(editItem({ path: currentPath, newName: edit.name }));
  };

  const handleAddMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdd({ ...add, addMode: !add.addMode });
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();

    const trimmedName = add.name.trim();
    if (trimmedName.length === 0) {
      setAdd({ ...add, invalid: true });
      setTimeout(() => {
        setAdd({ ...add, invalid: false });
      }, 2500);
      return;
    }

    dispatch(
      addItem({ path: currentPath, newItem: { name: add.name, items: [] } })
    );
    setAdd({ ...add, addMode: false, name: "" });

    setExpand(true);
  };

  const handleDelete = () => {
    dispatch(deleteItem({ path: currentPath }));
  };

  return (
    <>
      <div
        className="group flex items-center cursor-pointer gap-2"
        onClick={handleExpand}
        aria-label={`Toggle ${data.name}`}
      >
        {isFolder ? (
          <Folder className="w-4 h-4" fill={expand ? "#FFF" : "#000"} />
        ) : (
          <File className="w-4 h-4" />
        )}
        <div className="py-1 hover:underline">
          {edit.editMode ? (
            <div className="flex items-center">
              <input
                type="text"
                autoFocus
                onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                onClick={(e) => e.stopPropagation()}
                value={edit.name}
                className="border rounded-md shadow-sm border-gray-300 px-3 text-sm"
                style={{ border: edit.invalid ? "1px solid red" : "" }}
                aria-label={`Edit name for ${data.name}`}
              />
              <Check
                className="-ml-[20px] w-[18px] h-[18px] rounded-lg p-[2px] hover:bg-gray-200 transition"
                onClick={handleEdit}
                aria-label={`Save name for ${data.name}`}
              />
            </div>
          ) : (
            data.name
          )}
        </div>
        {data.name !== "folder-tree" && (
          <>
            {isFolder && (
              <>
                <Plus
                  className="tool-btn"
                  style={{ display: add.addMode ? "block" : "" }}
                  onClick={handleAddMode}
                />
                {add.addMode && (
                  <div className="flex items-center">
                    <input
                      type="text"
                      autoFocus
                      onChange={(e) => setAdd({ ...add, name: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      value={add.name}
                      className="border rounded-md shadow-sm border-gray-300 px-3 text-sm"
                      style={{ border: add.invalid ? "1px solid red" : "" }}
                      placeholder="New folder or file..."
                      aria-label={`New folder name inside ${data.name}`}
                    />
                    <Check
                      className="-ml-[20px] w-[18px] h-[18px] rounded-lg p-[2px] hover:bg-gray-200 transition"
                      onClick={handleAdd}
                      aria-label={`Add folder inside ${data.name}`}
                    />
                  </div>
                )}
              </>
            )}

            <Pencil
              className="tool-btn"
              onClick={handleEditMode}
              aria-label={`Edit ${data.name}`}
            />
            <Trash2
              className="tool-btn"
              onClick={handleDelete}
              aria-label={`Delete ${data.name}`}
            />
          </>
        )}
      </div>
      <div
        className="pl-5 border-l border-gray-300 hover:border-gray-600 transition overflow-hidden"
        style={expandStyle}
      >
        {data.items.map((item, index) => (
          <FolderTree
            key={item.name + index}
            data={item}
            expanded={expand}
            prevPath={currentPath}
          />
        ))}
      </div>
    </>
  );
}

export default FolderTree;
