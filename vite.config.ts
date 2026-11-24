//@ts-nocheck
declare global {
  const Salla: any;
}
import { defineConfig } from 'vite';
import {
sallaBuildPlugin,
sallaDemoPlugin,
sallaTransformPlugin,
} from '@salla.sa/twilight-bundles/vite-plugins';
export default defineConfig({
plugins: [
  {
    name: 'salla-windows-preview-path',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        // The current Salla demo plugin emits /@fsC:/... on Windows.
        if (request.url?.startsWith('/@fsC:/')) {
          request.url = request.url.replace('/@fsC:/', '/@fs/C:/');
        }
        next();
      });
    },
  },
  sallaTransformPlugin(),
  sallaBuildPlugin(),
  sallaDemoPlugin({
    // Uncomment to preview only specific components
    // components: ['product-card', 'scroll-top', 'table-list']
  }),
],
});
