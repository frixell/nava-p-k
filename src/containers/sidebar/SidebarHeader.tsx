import React from 'react';
import { HeaderSection, SidebarImage, SidebarImageWrapper, SidebarText } from './SidebarStyles';

interface SidebarHeaderProps {
  isEnglish: boolean;
  isMobile: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isEnglish, isMobile }) => (
  <HeaderSection isMobile={isMobile} isEnglish={isEnglish}>
    <SidebarImageWrapper isMobile={isMobile}>
      <SidebarImage
        isEnglish={isEnglish}
        src="https://res.cloudinary.com/dewafmxth/image/upload/v1587375229/nava_ky02kt.jpg"
        alt={isEnglish ? 'Nava Kainer-Persov' : 'נאוה קיינר-פרסוב'}
      />
    </SidebarImageWrapper>
    <div>
      <SidebarText isEnglish={isEnglish}>
        {isEnglish
          ? 'Urban regeneration comparative global case studies'
          : 'התחדשות ערונית מקרי מחקר השוואתי גלובלי'}
      </SidebarText>
      <SidebarText isEnglish={isEnglish} isSpaced className="mobile">
        {isEnglish ? 'New tool for comparative research' : 'כלי חדש למחקר השוואתי'}
      </SidebarText>
    </div>
  </HeaderSection>
);

export default SidebarHeader;
