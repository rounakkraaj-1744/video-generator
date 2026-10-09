import { z } from 'zod';

const baseSceneSchema = z.object({
  id: z.string(),
  start: z.number().nonnegative(),
  duration: z.number().positive(),
  narration: z.string(),
});

export const hookSceneSchema = baseSceneSchema.extend({
  type: z.literal('hook'),
  title: z.string(),
});

export const textSceneSchema = baseSceneSchema.extend({
  type: z.literal('text'),
  text: z.string(),
});

export const codeSceneSchema = baseSceneSchema.extend({
  type: z.literal('code'),
  language: z.enum([
    'typescript',
    'javascript',
    'java',
    'python',
    'sql',
    'bash',
  ]),
  code: z.string(),
  highlightedLines: z.array(z.number().int().positive()).optional(),
});

export const diagramSceneSchema = baseSceneSchema.extend({
  type: z.literal('diagram'),
  nodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
  edges: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
      label: z.string().optional(),
    }),
  ),
});

export const SceneSchema = z.discriminatedUnion('type', [
  hookSceneSchema,
  textSceneSchema,
  codeSceneSchema,
  diagramSceneSchema,
]);

export type Scene = z.infer<typeof SceneSchema>;