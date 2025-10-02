import React from 'react';
import CvContentStrip, { type SyntheticSetDataEvent } from '../components/cvpage/CvContentStrip';
import { CvStructure, CvLeftColumn, HeaderContainer, PageHeading } from './CvBody.styles';

interface CvBodyProps {
  isAuthenticated: boolean;
  language: string;
  cvpage: any;
  cvpageOrigin: any;
  setData: (event: SyntheticSetDataEvent) => void;
}

const CvBody: React.FC<CvBodyProps> = ({ isAuthenticated, language, cvpage, cvpageOrigin, setData }) => (
  <CvStructure>
    <CvLeftColumn>
      <HeaderContainer>
        <PageHeading>{language === 'en' ? 'CV' : 'קורות חיים'}</PageHeading>
      </HeaderContainer>
      <CvContentStrip
        isAuthenticated={isAuthenticated}
        cvpageOrigin={cvpageOrigin}
        cvpage={cvpage}
        setData={setData}
      />
    </CvLeftColumn>
  </CvStructure>
);

export default CvBody;
