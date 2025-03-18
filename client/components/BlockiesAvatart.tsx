import React, { useEffect, useState } from "react";
import blockies from "ethereum-blockies";

interface BlockiesAvatarProps {
  address: string;
  size?: number;
  scale?: number;
}

const BlockiesAvatar: React.FC<BlockiesAvatarProps> = ({ address, size = 50, scale = 5 }) => {
  const [imageSrc, setImageSrc] = useState<string>("0x3574cC3Ad823493B2516f2bC6b08F3C1E88f3685");

  useEffect(() => {
    const icon = blockies.create({ seed: address, size: 8, scale }); // Tạo hình ảnh blockies
    setImageSrc(icon.toDataURL()); // Chuyển thành Data URL để hiển thị trong <img>
  }, [address, scale]);

  return <img src={imageSrc} alt="Blockies Avatar" className="rounded-[50%]" width={size} height={size} />;
};

export default BlockiesAvatar;
