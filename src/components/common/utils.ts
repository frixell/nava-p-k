export interface Photo {
  width: number;
  height: number;
  [key: string]: any;
}

export interface ComputeSizesParams {
  photos: Photo[];
  columns: number;
  width: number;
  margin: number;
}

export interface SizedPhoto extends Photo {
  width: number;
  height: number;
}

export function round(value: number, decimals: number = 0): number {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

// return two decimal places rounded number
export function ratio({ width, height }: { width: number; height: number }): number {
  return round(width / height, 2);
}

// takes the Gallery's photos prop object, width of the container,
// margin between photos Gallery prop, and columns Gallery prop.
// calculates, sizes based on columns and returns the photos object with new height/width props
export function computeSizes({ photos, columns, width, margin }: ComputeSizesParams): SizedPhoto[] {
  if (!width) {
    return [];
  }
  // divide photos over rows, max cells based on `columns`
  // effectively resulting in [[0, 1, 2], [3, 4, 5], [6, 7]]
  const rows = photos.reduce((acc: Photo[][], cell: Photo, idx: number) => {
    const row = Math.floor(idx / columns);
    acc[row] = acc[row] ? [...acc[row], cell] : [cell];
    return acc;
  }, []);

  // calculate total ratio of each row, and adjust each cell height and width
  // accordingly.
  const lastRowIndex = rows.length - 1;
  const rowsWithSizes = rows.map((row: Photo[], rowIndex: number) => {
    const totalRatio = row.reduce((result: number, photo: Photo) => result + ratio(photo), 0);
    const rowWidth = width - row.length * (margin * 2);

    // assign height, but let height of a single photo in the last
    // row not expand across columns so divide by columns
    const height = (rowIndex !== lastRowIndex || row.length > 1)
        ? rowWidth / totalRatio
        : rowWidth / totalRatio;

    return row.map((photo: Photo): SizedPhoto => ({
      ...photo,
      height: round(height, 1),
      width: round(height * ratio(photo), 1),
    }));
  });
  return rowsWithSizes.reduce((acc: SizedPhoto[], row: SizedPhoto[]) => [...acc, ...row], []);
}
