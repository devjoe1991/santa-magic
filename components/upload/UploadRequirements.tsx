export default function UploadRequirements() {
  return (
    <div className="mt-4 rounded-xl border border-warmGold/20 bg-gradient-to-r from-frostBlue/10 to-warmGold/10 p-4 sm:mt-6 sm:p-6">
      <h3 className="mb-3 flex items-center font-heading text-sm font-bold text-charcoal sm:text-base">
        <span className="mr-2 text-christmasRed">📋</span>
        Photo Requirements
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs sm:gap-3 sm:text-sm">
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