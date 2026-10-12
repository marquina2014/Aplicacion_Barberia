import { calcularMontoFinal, FORMULA_INICIAL } from './formulasUtils';

/**
 * Generador nativo de archivos Microsoft Excel (.xlsx - OpenXML) sin dependencias externas.
 * Incluye columnas de Monto Original ($) y Monto Final ($) con bordes dorados y letras negras.
 */
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const escXml = (val) =>
  String(val ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const crearZipStore = (archivos) => {
  const enc = new TextEncoder();
  const locales = [];
  const centrales = [];
  let offset = 0;

  archivos.forEach(({ nombre, contenido }) => {
    const nameBytes = enc.encode(nombre);
    const dataBytes = enc.encode(contenido);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    const local = new Uint8Array(30 + nameBytes.length + size);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, size, true); lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    local.set(nameBytes, 30); local.set(dataBytes, 30 + nameBytes.length);
    locales.push(local);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, size, true); cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true); cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centrales.push(central);
    offset += local.length;
  });

  const centralSize = centrales.reduce((a, b) => a + b.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, archivos.length, true); ev.setUint16(10, archivos.length, true);
  ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);

  return new Blob([...locales, ...centrales, eocd], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
};

const celdaTexto = (ref, texto, style = 4) => `<c r="${ref}" s="${style}" t="inlineStr"><is><t>${escXml(texto)}</t></is></c>`;
const celdaNumero = (ref, num, style = 2) => `<c r="${ref}" s="${style}" t="n"><v>${Number(num || 0)}</v></c>`;

export const exportarVentasExcel = (ventas = [], nombreBase = 'Ventas_Legendario', formula = FORMULA_INICIAL) => {
  const colsTexto = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const headers = ['ID Venta', 'Fecha', 'Registro / Hora', 'Barbero (Vendedor)', 'Cliente', 'Servicio Realizado', 'Método de Pago', 'Monto Original ($)', 'Monto Final ($)'];
  const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  let filasXml = `<row r="1" ht="24" customHeight="1">${headers.map((h, i) => celdaTexto(`${letras[i]}1`, h, 1)).join('')}</row>`;
  let totalOriginal = 0;
  let totalFinal = 0;

  ventas.forEach((v, idx) => {
    const r = idx + 2;
    const montoOrig = Number(v.monto || 0);
    const montoFin = v.montoFinal !== undefined ? Number(v.montoFinal) : calcularMontoFinal(montoOrig, formula);
    totalOriginal += montoOrig;
    totalFinal += montoFin;
    filasXml += `<row r="${r}" ht="20" customHeight="1">` +
      celdaTexto(`A${r}`, v.id || '') + celdaTexto(`B${r}`, v.fechaISO || '') +
      celdaTexto(`C${r}`, v.fechaHora || '') + celdaTexto(`D${r}`, v.vendedor || '') +
      celdaTexto(`E${r}`, v.cliente || '') + celdaTexto(`F${r}`, v.servicio || '') +
      celdaTexto(`G${r}`, v.pago || '') + celdaNumero(`H${r}`, montoOrig, 2) +
      celdaNumero(`I${r}`, montoFin, 2) + `</row>`;
  });

  const filaTotal = ventas.length + 2;
  filasXml += `<row r="${filaTotal}" ht="22" customHeight="1">` +
    colsTexto.map((c, i) => celdaTexto(`${c}${filaTotal}`, i === 6 ? 'TOTAL FACTURADO' : '', 1)).join('') +
    celdaNumero(`H${filaTotal}`, totalOriginal, 3) + celdaNumero(`I${filaTotal}`, totalFinal, 3) + `</row>`;

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="14" customWidth="1"/><col min="2" max="2" width="15" customWidth="1"/>
    <col min="3" max="3" width="18" customWidth="1"/><col min="4" max="4" width="24" customWidth="1"/>
    <col min="5" max="5" width="24" customWidth="1"/><col min="6" max="6" width="26" customWidth="1"/>
    <col min="7" max="7" width="18" customWidth="1"/><col min="8" max="8" width="20" customWidth="1"/>
    <col min="9" max="9" width="20" customWidth="1"/>
  </cols>
  <sheetData>${filasXml}</sheetData>
</worksheet>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1"><numFmt numFmtId="164" formatCode="$#,##0.00"/></numFmts>
  <fonts count="2">
    <font><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/></font>
  </fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="3">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"><color rgb="FFD4AF37"/></left><right style="thin"><color rgb="FFD4AF37"/></right><top style="thin"><color rgb="FFD4AF37"/></top><bottom style="thin"><color rgb="FFD4AF37"/></bottom><diagonal/></border>
    <border><left style="medium"><color rgb="FFD4AF37"/></left><right style="medium"><color rgb="FFD4AF37"/></right><top style="medium"><color rgb="FFD4AF37"/></top><bottom style="medium"><color rgb="FFD4AF37"/></bottom><diagonal/></border>
  </borders>
  <cellXfs count="5">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="2" applyFont="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
    <xf numFmtId="164" fontId="1" fillId="0" borderId="2" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyBorder="1"/>
  </cellXfs>
</styleSheet>`;

  const blob = crearZipStore([
    { nombre: '[Content_Types].xml', contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { nombre: '_rels/.rels', contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { nombre: 'xl/workbook.xml', contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Reporte Ventas" sheetId="1" r:id="rId1"/></sheets></workbook>` },
    { nombre: 'xl/_rels/workbook.xml.rels', contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { nombre: 'xl/styles.xml', contenido: stylesXml },
    { nombre: 'xl/worksheets/sheet1.xml', contenido: sheetXml }
  ]);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nombreBase}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
