export default function QuickGuide() {
  return (
    <div className="bg-[#1f1131] rounded-[40px] p-6 border-[4px] border-[#ffcaef]">
      <h3 className="text-[#f181b6] font-header text-4xl mb-4">Quick Guide</h3>
      <div className="text-white font-body text-xl space-y-3 leading-relaxed">
        <p>
          <strong>1. Add Root</strong> – Enter a value and click "Add Root" to create the root node.
        </p>
        <p>
          <strong>2. Node Operations</strong> – Click a button to enable input, enter value, press Enter:
        </p>
        <p>
          <strong>• Search</strong> – Find a node in the tree
        </p>
        <p>
          <strong>• Insert</strong> – Add a new node (placed by BST rules)
        </p>
        <p>
          <strong>• Delete</strong> – Remove a node from the tree
        </p>
        <p>
          <strong>3. Tree Operations:</strong>
        </p>
        <p>
          <strong>• Get Max</strong> – Display the highest value in the tree
        </p>
        <p>
          <strong>• Get Height</strong> – Click button, enter node value, press Enter to see its height
        </p>
        <p>
          <strong>• Clear Tree</strong> – Remove all nodes and reset
        </p>
      </div>
    </div>
  );
}
