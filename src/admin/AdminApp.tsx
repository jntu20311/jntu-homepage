import { Fragment } from "react";
import { Refine, Authenticated } from "@refinedev/core";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { Routes, Route, useParams } from "react-router-dom";
import { authProvider } from "./authProvider";
import { dataProvider, adminUsersProvider } from "./dataProvider";
import { resources as resourceDefs } from "./config";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { ResourceList } from "./components/ResourceList";
import { ResourceForm } from "./components/ResourceForm";

const EditRoute = ({ resource }: { resource: (typeof resourceDefs)[number] }) => {
  const { id } = useParams<{ id: string }>();
  // 리소스/레코드 변경 시 폼을 새로 마운트해 이전 값이 남지 않도록 함
  return (
    <ResourceForm
      key={`${resource.name}-${id}`}
      resource={resource}
      action="edit"
      id={id}
    />
  );
};

const refineResources = resourceDefs.map((r) => ({
  name: r.name,
  list: `/admin/${r.name}`,
  create: r.canCreate !== false ? `/admin/${r.name}/create` : undefined,
  edit: r.canEdit !== false ? `/admin/${r.name}/edit/:id` : undefined,
  meta: {
    label: r.label,
    dataProviderName: r.dataProviderName,
  },
}));

export default function AdminApp() {
  return (
    <Refine
      dataProvider={{
        default: dataProvider,
        adminUsers: adminUsersProvider,
      }}
      authProvider={authProvider}
      routerProvider={routerBindings}
      resources={refineResources}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        disableTelemetry: true,
      }}
    >
      <Routes>
        <Route path="login" element={<LoginPage />} />

        <Route
          element={
            <Authenticated
              key="admin-protected"
              fallback={<CatchAllNavigate to="/admin/login" />}
            >
              <Layout />
            </Authenticated>
          }
        >
          <Route index element={<NavigateToResource resource="banners" />} />
          {resourceDefs.map((r) => (
            <Fragment key={r.name}>
              <Route
                path={r.name}
                element={<ResourceList key={r.name} resource={r} />}
              />
              {r.canCreate !== false && (
                <Route
                  path={`${r.name}/create`}
                  element={
                    <ResourceForm
                      key={`${r.name}-create`}
                      resource={r}
                      action="create"
                    />
                  }
                />
              )}
              {r.canEdit !== false && (
                <Route
                  path={`${r.name}/edit/:id`}
                  element={<EditRoute resource={r} />}
                />
              )}
            </Fragment>
          ))}
        </Route>
      </Routes>

      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
    </Refine>
  );
}
