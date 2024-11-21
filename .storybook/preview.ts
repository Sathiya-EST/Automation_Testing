import type { Preview } from "@storybook/react";
import '../src/index.css';
import '../src/utils/i18n';
import '../src/style/global.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
