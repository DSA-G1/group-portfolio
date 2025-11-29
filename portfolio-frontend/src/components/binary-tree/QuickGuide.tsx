export default function QuickGuide() {
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-[#f181b6] font-header text-4xl mb-4">Quick Guide</h3>
      <div className="text-white font-body text-xl space-y-3 leading-relaxed">
        <p>
          <strong>1. Create Root</strong> - Enter a number and click "Create Root" to start your tree.
        </p>
        <p>
          <strong>2. Add Nodes</strong> - Enter a parent node value and click search ( 🔎︎ ) to find it. Once
          highlighted, enter the new value, choose Left or Right direction, then click "Insert Node".
        </p>
        <p>
          <strong>3. Delete Nodes</strong> - Search for the node you want to remove. When it's highlighted, click
          "Delete Node".
        </p>
        <p>
          <strong>4. Post-Order Traversal</strong> - The sequence below the tree updates automatically, showing the Left
          → Right → Root traversal order.
        </p>
      </div>
    </div>
  );
}