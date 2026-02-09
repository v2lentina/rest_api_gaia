import axios from "axios";
import { WikipediaImage } from "../types/api";

const WIKIPEDIA_MEDIA_BASE =
  "https://api.wikimedia.org/core/v1/wikipedia/en/page";

async function fetchWikipediaImages(
  wikipediaTitle: string
): Promise<WikipediaImage[]> {
  try {
    const url = `${WIKIPEDIA_MEDIA_BASE}/${encodeURIComponent(
      wikipediaTitle
    )}/links/media`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
      },
      timeout: 8000,
    });

    const files = response.data?.files || [];

    return files.filter(
      (file: any) =>
        file.preferred?.mediatype === "BITMAP" ||
        file.preferred?.mediatype === "DRAWING"
    );
  } catch (error) {
    console.warn(
      `Failed to fetch Wikipedia images for "${wikipediaTitle}":`,
      (error as Error).message
    );
    return [];
  }
}

export class WikiMediaAdapter {
  async fetchImagesByTitle(enwikiTitle: string): Promise<WikipediaImage[]> {
    let images: WikipediaImage[] = [];
    if (enwikiTitle) {
      try {
        images = await fetchWikipediaImages(enwikiTitle);
      } catch (imageError) {
        console.warn(
          "Wikipedia images fetch failed:",
          (imageError as Error).message
        );
      }
    }
    return images;
  }
  catch(error: unknown) {
    console.error(
      "WikiMedia fetch failed completely:",
      (error as Error).message
    );
    return [] as WikipediaImage[];
  }
}
