export default function UploadRequirements() {
  return (
    <div className="mt-6 rounded-xl border border-warmGold/20 bg-gradient-to-r from-frostBlue/10 to-warmGold/10 p-6">
      <h3 className="mb-4 flex items-center font-heading font-bold text-charcoal">
        <span className="mr-2 text-christmasRed">📋</span>
        Photo Requirements
      </h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-warmGold">📄</span>
          <span className="font-body text-charcoal/70">
            JPG, PNG, WebP
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-evergreen">💾</span>
          <span className="font-body text-charcoal/70">
            Max 20MB
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-christmasRed">💡</span>
          <span className="font-body text-charcoal/70">
            Well-lit doorway
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-warmGold">👁️</span>
          <span className="font-body text-charcoal/70">
            Clear entrance view
          </span>
        </div>
      </div>
    </div>
  );
}