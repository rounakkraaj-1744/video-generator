import {z} from "zod"
import { SceneSchema } from "./scenes.schema";

export const videoProjectSchema = z
  .object({
    version: z.literal(1),
    title: z.string(),
    duration: z.number().positive(),
    fps: z.number().int().positive(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    scenes: z.array(SceneSchema).min(1),
  }).superRefine((project, ctx) => {
    const ids = new Set<string>();

    project.scenes.forEach((scene, index) => {
      if (ids.has(scene.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['scenes', index, 'id'],
          message: `Duplicate scene ID: ${scene.id}`,
        });
      }

      ids.add(scene.id);

      if (scene.start + scene.duration > project.duration) {
        ctx.addIssue({
          code: 'custom',
          path: ['scenes', index],
          message: 'Scene extends beyond project duration',
        });
      }

      if (scene.type === 'diagram') {
        const nodeIds = new Set(scene.nodes.map((node) => node.id));

        scene.edges.forEach((edge, edgeIndex) => {
          if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
            ctx.addIssue({
              code: 'custom',
              path: ['scenes', index, 'edges', edgeIndex],
              message: 'Edge references an unknown node',
            });
          }
        });
      }
    });
  });