import { SITE_URL } from 'utils/constants'
import { MarkdownContentService } from 'services/content'

const Sitemap = () => {}

export const getServerSideProps = async ({ res }: any) => {
  const service = new MarkdownContentService()
  const items = await service.GetItems()
  const categories = await service.GetCategories()
  const tags = (await service.GetTags()).map((i) => i.key.toLowerCase().replace(/ /g, '%20').replace(/&/g, '%26'))

  const baseUrl = SITE_URL
  const currentDate = new Date().toISOString()
  const launchDate = new Date(2021, 8).toISOString()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${baseUrl}</loc>
                <lastmod>${currentDate}</lastmod>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>
            ${categories
              .map((i) => {
                return `
                    <url>
                        <loc>${baseUrl}${i.id}</loc>
                        <lastmod>${currentDate}</lastmod>
                        <changefreq>daily</changefreq>
                        <priority>0.8</priority>
                    </url>`
              })
              .join('')}
            ${items
              .map((i) => {
                return `
                    <url>
                        <loc>${baseUrl}${i.category.id}/${i.id}</loc>
                        <lastmod>${new Date(i.dateAdded).toISOString()}</lastmod>
                        <changefreq>monthly</changefreq>
                        <priority>0.5</priority>
                    </url>`
              })
              .join('')}
            <url>
                <loc>${baseUrl}tags</loc>
                <lastmod>${launchDate}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.6</priority>
            </url>
            ${tags
              .map((i) => {
                return `
                    <url>
                        <loc>${baseUrl}tags/${i}</loc>
                        <lastmod>${currentDate}</lastmod>
                        <changefreq>weekly</changefreq>
                        <priority>0.7</priority>
                    </url>`
              })
              .join('')}
            <url>
                <loc>${baseUrl}gas</loc>
                <lastmod>${launchDate}</lastmod>
                <changefreq>hourly</changefreq>
                <priority>0.7</priority>
            </url>
        </urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
