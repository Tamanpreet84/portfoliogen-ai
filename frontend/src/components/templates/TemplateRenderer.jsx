import React from 'react';
import { MinimalTemplate } from './MinimalTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { CreativeTemplate } from './CreativeTemplate';

export const TemplateRenderer = ({ activeTemplate, resumeData, portfolioTheme, sectionVisibility, sectionOrder }) => {
  const props = {
    resumeData,
    theme: portfolioTheme,
    sectionVisibility,
    sectionOrder
  };

  switch (activeTemplate) {
    case 'minimal':
      return <MinimalTemplate {...props} />;
    case 'creative':
      return <CreativeTemplate {...props} />;
    case 'developer':
    default:
      return <DeveloperTemplate {...props} />;
  }
};
