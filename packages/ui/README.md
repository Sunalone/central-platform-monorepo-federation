# @central-platform/ui

Shared Ant Design components for the central platform applications.

## Local Storybook

```bash
pnpm storybook
```

Open `http://localhost:6006` to view the component stories.

## Components

- `Button`: Ant Design button wrapper with a required `children` label and `red`/`blue`/`green`/`yellow`/`grey` color presets.
- `PlatformCard`: business content card with eyebrow, title and description.
- `MetricCard`: dashboard metric card with tone, icon and trend note.
- `StatusTag`: shared status tag with semantic tones.
- `QueryBar`: shared search and reset toolbar for list pages.

Import components from the package entry:

```tsx
import { Button, MetricCard, QueryBar, StatusTag } from '@central-platform/ui';

<Button color="blue">保存配置</Button>
```
