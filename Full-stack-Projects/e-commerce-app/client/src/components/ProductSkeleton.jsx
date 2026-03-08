import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductSkeleton = () => {
  return (
    <div className="w-full">
      <SkeletonTheme 
        baseColor="var(--skeleton-base)" 
        highlightColor="var(--skeleton-highlight)"
      >
        {/* Image area */}
        <div className="aspect-[3/4] overflow-hidden rounded-[2rem] mb-4">
          <Skeleton height="100%" borderRadius="2rem" />
        </div>
        
        {/* Title */}
        <div className="px-1">
          <Skeleton height={18} width="85%" />

          {/* price */}
          <div className="mt-3">
            <Skeleton height={20} width="30%" />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default ProductSkeleton;