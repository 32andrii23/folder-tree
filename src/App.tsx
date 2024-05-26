import {
  FolderTreeIcon,
  MousePointerClick,
  Search as SearchSvg,
} from "lucide-react";

import FolderTree from "./components/FolderTree";
import { useAppSelector } from "./hooks/redux";
import Search from "./components/Search";

function App() {
  const folderData = useAppSelector((state) => state.folder);

  return (
    <>
      <div className="m-4">
        <h1 className="text-3xl font-bold text flex items-center gap-2">
          Folder Tree
          <FolderTreeIcon className="w-8 h-8" />
        </h1>
        <h2 className="text-xl font-medium text-gray-500">
          Add, edit and delete expandable and collapsable folders
        </h2>
      </div>
      <div className="m-4 p-4 border border-gray-300 rounded-xl shadow-sm flex items-center gap-2 flex-col sm:flex-row">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Search and explore your files and folders:
        </h3>
        <div className="flex items-center gap-2">
          <SearchSvg className="sm:ml-8" />
          <Search />
        </div>
      </div>
      <div className="m-4 p-4 border border-gray-300 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium pb-3 mb-3 border-b border-gray-300 flex items-center gap-2">
          Start by opening the root folder
          <MousePointerClick />
        </h3>
        <FolderTree data={folderData} />
      </div>
    </>
  );
}

export default App;
