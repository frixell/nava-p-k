import React, { type ChangeEvent } from 'react';
import CvContentStrip from '../components/cvpage/CvContentStrip';
import { CvStructure, CvLeftColumn, HeaderContainer, PageHeading } from './CvBody.styles';

interface CvBodyProps {
  isAuthenticated: boolean;
  language: string;
  cvpage: any;
  cvpageOrigin: any;
  setData: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CvBody: React.FC<CvBodyProps> = ({ isAuthenticated, language, cvpage, cvpageOrigin, setData }) => (
  <CvStructure>
    <CvLeftColumn>
      <HeaderContainer>
        <PageHeading>{language === 'en' ? 'CV' : 'קורות חיים'}</PageHeading>
      </HeaderContainer>
      <CvContentStrip
        isAuthenticated={isAuthenticated}
        action="setString"
        name="cv"
        index="cv"
        item={cvpage?.about}
        cvpageOrigin={cvpageOrigin}
        cvpage={cvpage}
        setData={setData}
        lang={language}
      />
    </CvLeftColumn>
  </CvStructure>
);

export default CvBody;
