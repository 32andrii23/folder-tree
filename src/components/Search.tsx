import { useState } from "react";

import { useAppSelector } from "../hooks/redux";
import { IFolderData } from "../types";
import { File, Folder, HeartCrack } from "lucide-react";

interface SearchResult {
  node: IFolderData;
  path: string[];
}

function Search() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const folderTree = useAppSelector((state) => state.folder);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const searchTree = (
    node: IFolderData,
    query: string,
    currentPath: string[] = []
  ): SearchResult[] => {
    let results: SearchResult[] = [];
    const newPath = [...currentPath, node.name];

    if (node.name.toLowerCase().includes(query.toLowerCase())) {
      results.push({ node, path: newPath });
    }

    for (const item of node.items) {
      results = results.concat(searchTree(item, query, newPath));
    }

    return results;
  };

  const searchResults = query ? searchTree(folderTree, query) : [];

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ring-offset-2 focus:ring-black ring-offset-background"
        value={query}
        onChange={handleSearchChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Search"
      />
      {isFocused && query && (
        <div className="shadow-sm border rounded-lg border-gray-300 px-4 absolute top-[105%] flex flex-col bg-white">
          {searchResults.length === 0 && (
            <p className="flex items-center gap-2 animate-pulse py-4">
              No results found
              <HeartCrack />
            </p>
          )}
          {searchResults.map((result, index) => (
            <div key={result.node.name + index} className="py-2">
              <div className="flex items-center gap-2">
                {result.node.name.includes(".") ? (
                  <File className="w-4 h-4" />
                ) : (
                  <Folder className="w-4 h-4" />
                )}
                {result.node.name}
              </div>
              <p
                className="text-gray-500 text-[13px]"
                title={result.path.join(" / ")}
              >
                {result.path.join(" / ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
