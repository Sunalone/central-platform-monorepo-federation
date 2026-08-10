import type { Preview } from '@storybook/react-vite';
import { App } from 'antd';
import 'antd/dist/reset.css';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <App>
        <div className="storybook-canvas">
          <Story />
        </div>
      </App>
    ),
  ],
};

export default preview;
