# UI 包版本管理

Changesets 当前只管理 `@central-platform/ui`，其他 workspace 已在配置中忽略。

开发完成后记录一次变更：

```bash
pnpm changeset
```

按照提示选择 `@central-platform/ui`、版本类型（`patch`、`minor` 或 `major`），并填写中文变更说明。

发布前更新 UI 包版本和 `CHANGELOG.md`：

```bash
pnpm changeset:version
```

确认版本变更后，构建并发布 UI 包：

```bash
pnpm changeset:publish
```
