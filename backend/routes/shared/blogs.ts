import express, { Request, Response } from 'express';
const router = express.Router();
import Blog from '../../models/shared/Blog';

function slugify(value: any): string {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeBlogPayload(body: any): any {
  const payload = { ...body };

  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  if (typeof payload.published === 'string') {
    payload.published = payload.published === 'true' || payload.published === 'on';
  }
  if (typeof payload.tags === 'string') {
    payload.tags = payload.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }
  if (!Array.isArray(payload.showOn) || payload.showOn.length === 0) {
    payload.showOn = ['all'];
  }

  return payload;
}

// GET /api/blogs?page=home|category-slug|doctor-slug|treatment-slug&siteType=surgery|emergency
// With page query, return only published blogs matching showOn: all OR page.
// Without page query, return all blogs for the admin panel.
// siteType is optional — omitting it returns posts for every subdomain (unchanged default behavior).
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page, siteType } = req.query;
    const filter: any = page
      ? { published: true, showOn: { $in: ['all', page as string] } }
      : {};
    if (siteType) filter.siteType = siteType as string;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, total: blogs.length, data: blogs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, data: blog });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.create(normalizeBlogPayload(req.body));
    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, normalizeBlogPayload(req.body), {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found' });
      return;
    }
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
