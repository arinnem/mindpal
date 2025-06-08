import React from 'react';
import { initToolbar } from '@stagewise/toolbar';

const stagewiseConfig = {
  plugins: [
    {
      name: 'example-plugin',
      displayName: 'Example Plugin',
      pluginName: 'example-plugin',
      iconSvg: (
        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" fill="#F59E42"/>
        </svg>
      ),
      description: 'Adds additional context for your components',
      shortInfoForPrompt: () => {
        return "Context information about the selected element";
      },
      mcp: null,
      actions: [
        {
          name: 'Example Action',
          description: 'Demonstrates a custom action',
          execute: () => {
            window.alert('This is a custom action!');
          },
        },
      ],
    },
  ],
};

export function setupStagewise() {
  if (process.env.NODE_ENV === 'development') {
    initToolbar(stagewiseConfig);
  }
} 