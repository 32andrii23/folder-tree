import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFolderData } from '../../types';

const initialState: IFolderData = {
  name: "folder-tree",
  items: [
    {
      name: "public",
      items: [
        {
          name: "index.html",
          items: []
        }
      ]
    },
    {
      name: "src",
      items: [
        {
          name: "components",
          items: [
            {
              name: "Folder.js",
              items: []
            }
          ]
        },
        {
          name: "App.js",
          items: []
        },
        {
          name: "index.js",
          items: []
        },
        {
          name: "styles.css",
          items: []
        }
      ]
    },
    {
      name: "package.json",
      items: []
    }
  ]
};

interface PathPayload {
  path: string[];
}

interface AddPayload extends PathPayload {
  newItem: IFolderData;
}

interface EditPayload extends PathPayload {
  newName: string;
}

const folderSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    editItem: (state, action: PayloadAction<EditPayload>) => {
      const { path, newName } = action.payload;
      const currentNode = state;
      traverseAndEdit(currentNode, path, newName);
    },
    addItem: (state, action: PayloadAction<AddPayload>) => {
      const { path, newItem } = action.payload;
      const currentNode = state;
      traverseAndAdd(currentNode, path, newItem);
    },
    deleteItem: (state, action: PayloadAction<PathPayload>) => {
      const { path } = action.payload;
      const currentNode = state;
      traverseAndDelete(currentNode, path);
    }
  },
});

function traverseAndEdit(currentNode: IFolderData, path: string[], newName: string) {if (path.length === 0) {
    return;
  }
  if (currentNode.name !== path[0]) {
    throw new Error(`Root node name does not match the first element in the path`);
  }
  for (let i = 1; i < path.length; i++) {
    const nodeName = path[i];
    const foundNode = currentNode.items.find(item => item.name === nodeName);
    if (!foundNode) {
      throw new Error(`Node with name ${nodeName} not found`);
    }
    if (i === path.length - 1) {
      foundNode.name = newName;
    } else {
      currentNode = foundNode;
    }
  }
}

function traverseAndAdd(currentNode: IFolderData, path: string[], newItem: IFolderData) {
  if (path.length === 0) {
    return;
  }
  if (currentNode.name !== path[0]) {
    throw new Error(`Root node name does not match the first element in the path`);
  }
  for (let i = 1; i < path.length; i++) {
    const nodeName = path[i];
    const foundNode = currentNode.items.find(item => item.name === nodeName);
    if (!foundNode) {
      throw new Error(`Node with name ${nodeName} not found`);
    }
    if (i === path.length - 1) {
      foundNode.items.push(newItem);
    } else {
      currentNode = foundNode;
    }
  }
}

function traverseAndDelete(currentNode: IFolderData, path: string[]) {
  if (path.length === 0) {
    return;
  }
  if (currentNode.name !== path[0]) {
    throw new Error(`Root node name does not match the first element in the path`);
  }
  for (let i = 1; i < path.length; i++) {
    const nodeName = path[i];
    const foundNodeIndex = currentNode.items.findIndex(item => item.name === nodeName);
    if (foundNodeIndex === -1) {
      throw new Error(`Node with name ${nodeName} not found`);
    }
    if (i === path.length - 1) {
      currentNode.items.splice(foundNodeIndex, 1);
    } else {
      currentNode = currentNode.items[foundNodeIndex];
    }
  }
}

export const { editItem, addItem, deleteItem } = folderSlice.actions;
export default folderSlice.reducer;
