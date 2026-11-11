# Fondos de pantalla SEN6 en Blender (todo por script).
# Uso: blender -b -P fondos.py -- --escena 1 --formato ultrawide|16x9|telefono [--samples 64] [--out ruta.png]
import bpy, sys, math, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
def arg(k, d=None):
    return argv[argv.index(k) + 1] if k in argv else d
ESC = int(arg("--escena", "1")); FMT = arg("--formato", "16x9"); SAMPLES = int(arg("--samples", "64"))
TAM = {"ultrawide": (5120, 2160), "16x9": (3840, 2160), "telefono": (1290, 2796)}[FMT]
OUT = arg("--out", f"/tmp/fondo-{ESC}-{FMT}.png")
ESCALA = float(arg("--escala", "1"))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.resolution_x, sc.render.resolution_y = int(TAM[0] * ESCALA), int(TAM[1] * ESCALA)
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try: sc.render.engine = eng; break
    except Exception: pass
try: sc.eevee.taa_render_samples = SAMPLES
except Exception: pass
for k, v in (("use_gtao", True), ("use_shadows", True), ("use_raytracing", True), ("shadow_ray_count", 3), ("shadow_step_count", 8)):
    try: setattr(sc.eevee, k, v)
    except Exception: pass
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "None"
sc.view_settings.exposure = 0.0
sc.render.image_settings.file_format = "PNG"
sc.render.film_transparent = False

def hexlin(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c] + [1]

NAR, TIN, CRE, PAP, OLI, CHI, SUN, BLA = "#D06224", "#191919", "#E8D8BA", "#F0E9E3", "#8A8635", "#AE431E", "#EAC891", "#FFFFFF"

def mat(nombre, hx, rough=0.85, sheen=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = hexlin(hx)
    b.inputs["Roughness"].default_value = rough
    try: b.inputs["Specular IOR Level"].default_value = 0.25
    except Exception: pass
    return m

def ponmat(o, m):
    o.data.materials.clear(); o.data.materials.append(m); return o

def suave(o, seg=2):
    bpy.context.view_layer.objects.active = o
    bev = o.modifiers.new("bev", "BEVEL"); bev.width = 0.03; bev.segments = seg
    return o

def caja(nombre, size, loc, m, bevel=True):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object; o.name = nombre; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel: suave(o)
    return ponmat(o, m)

def esfera(r, loc, m):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=96, ring_count=48)
    o = bpy.context.object; bpy.ops.object.shade_smooth(); return ponmat(o, m)

def cono(r, h, loc, m):
    bpy.ops.mesh.primitive_cone_add(radius1=r, depth=h, location=(loc[0], loc[1], loc[2] + h / 2), vertices=128)
    o = bpy.context.object; bpy.ops.object.shade_smooth_by_angle() if hasattr(bpy.ops.object, "shade_smooth_by_angle") else bpy.ops.object.shade_smooth()
    return ponmat(o, m)

def aro(R, r, loc, rot, m):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=loc, rotation=rot, major_segments=128, minor_segments=48)
    o = bpy.context.object; bpy.ops.object.shade_smooth(); return ponmat(o, m)

def cilindro(r, h, loc, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=128)
    o = bpy.context.object; suave(o, 3); bpy.ops.object.shade_smooth_by_angle() if hasattr(bpy.ops.object, "shade_smooth_by_angle") else None
    return ponmat(o, m)

def medio_cilindro(r, h, loc, m, rot=(0, 0, 0)):
    # arco: cilindro cortado a la mitad con booleana
    o = cilindro(r, h, loc, m, rot)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(loc[0], loc[1], loc[2] - r)); c = bpy.context.object
    c.scale = (r * 2.2, h * 2, r * 2); c.hide_render = True; c.display_type = "WIRE"
    bo = o.modifiers.new("corte", "BOOLEAN"); bo.object = c; bo.operation = "DIFFERENCE"
    return o

def ciclorama(fondo_hex, piso_hex=None, y0=4.0, R=7.0):
    # ciclorama curvo (piso que sube en curva a la pared): sin línea de horizonte
    m = mat("fondo", fondo_hex, 0.95)
    perfil = [(-80.0, 0.0)] + [(y0 * i / 10, 0.0) for i in range(-10, 1)][1:]
    for i in range(1, 33):
        a = -math.pi / 2 + (math.pi / 2) * i / 32
        perfil.append((y0 + R * math.cos(a), R + R * math.sin(a)))
    perfil.append((y0 + R, 80.0))
    verts, caras = [], []
    for x in (-90.0, 90.0):
        for (y, z) in perfil: verts.append((x, y, z))
    n = len(perfil)
    for i in range(n - 1): caras.append((i, i + 1, n + i + 1, n + i))
    me = bpy.data.meshes.new("cyc"); me.from_pydata(verts, [], caras); me.update()
    o = bpy.data.objects.new("cyc", me); sc.collection.objects.link(o)
    for f in me.polygons: f.use_smooth = True
    return ponmat(o, m)

def sol(energia, rot, tam=2.0, color=(1.0, 0.93, 0.84)):
    bpy.ops.object.light_add(type="SUN", rotation=rot); l = bpy.context.object
    l.data.energy = energia; l.data.angle = math.radians(tam); l.data.color = color
    return l

def area(energia, loc, size, color=(1, 0.95, 0.9)):
    bpy.ops.object.light_add(type="AREA", location=loc); l = bpy.context.object
    l.data.energy = energia; l.data.size = size; l.data.color = color
    d = Vector((0, 0, 1)) - Vector(loc); l.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return l

def mundo(hx, fuerza):
    w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes["Background"]; bg.inputs[0].default_value = hexlin(hx); bg.inputs[1].default_value = fuerza

def camara(objetivo, dist, alt, focal_ancho, foco_tel):
    """Formatos anchos: encuadre fijo en vertical (ultrawide = mismo alto, más aire a los lados).
    Teléfono: encuadre fijo en horizontal y la cámara se aleja para que el bodegón quepa de ancho."""
    tx, ty, tz = objetivo
    bpy.ops.object.camera_add(); c = bpy.context.object; sc.camera = c
    cam = c.data
    if FMT == "telefono":
        cam.sensor_fit = "HORIZONTAL"; cam.lens = foco_tel
        tz_t = tz + foco_tel_off
    else:
        cam.sensor_fit = "VERTICAL"; cam.lens = focal_ancho
        tz_t = tz
    c.location = (tx, ty - dist, alt)
    d = Vector((tx, ty, tz_t)) - c.location
    c.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return c

foco_tel_off = 0.0

# ---------------- escenas ----------------
if ESC == 1:
    # BODEGÓN: escalones crema, esfera naranja, cubo tinta, cono sunset, aro oliva. Fondo crema.
    ciclorama(CRE, PAP)
    mc = mat("crema", "#E2CFAE"); mn = mat("nar", NAR, 0.7); mt = mat("tin", TIN, 0.8); ms = mat("sun", SUN, 0.8); mo = mat("oli", OLI, 0.75)
    caja("esc1", (6.0, 3.0, 0.8), (0, 0, 0.4), mc)
    caja("esc2", (3.6, 2.4, 0.8), (0.9, 0.4, 1.2), mc)
    caja("esc3", (1.6, 1.8, 0.8), (1.9, 0.7, 2.0), mc)
    esfera(0.95, (-1.55, -0.2, 0.8 + 0.95), mn)
    caja("cubo", (1.15, 1.15, 1.15), (0.35, 0.1, 1.6 + 0.575), mt)
    cono(0.62, 1.55, (1.95, 0.75, 2.4), ms)
    aro(0.42, 0.13, (-0.2, -0.85, 0.8 + 0.55), (math.radians(90), 0, math.radians(-20)), mo)
    mundo(CRE, 0.35)
    sol(2.6, (math.radians(52), 0, math.radians(-38)), 1.5)
    area(140, (-6, -6, 6), 6, (1, 0.96, 0.92))
    foco_tel_off = 0.45
    camara((0.2, 0.3, 1.45), 15, 4.2, 58, 66)

elif ESC == 2:
    # NOCHE: fondo tinta, esfera naranja gigante, aro oliva y semicírculo crema. Luz rasante cálida.
    ciclorama("#1E1C1A", "#191919")
    mn = mat("nar", NAR, 0.6); mo = mat("oli", OLI, 0.7); mc = mat("crema", CRE, 0.85); ms = mat("sun", SUN, 0.8)
    esfera(1.6, (0.9, 0.6, 1.6), mn)
    aro(1.05, 0.12, (-1.7, -0.6, 1.05 + 0.12), (math.radians(90), 0, math.radians(18)), mo)
    medio_cilindro(0.9, 0.5, (-0.6, 1.4, 0.0), mc, (math.radians(90), 0, 0))
    caja("losa", (2.2, 0.35, 0.35), (2.6, -0.9, 0.175), mat("chile", CHI, 0.8))
    mundo("#191919", 0.25)
    sol(5.5, (math.radians(70), 0, math.radians(-60)), 1.2, (1, 0.82, 0.62))
    area(120, (5, -4, 3), 4, (1, 0.7, 0.45))
    foco_tel_off = 0.45
    camara((0.3, 0.3, 1.25), 16, 3.0, 55, 54)

elif ESC == 3:
    # NARANJA: fondo naranja, cubo tinta, columna crema, esfera crema, cono tinta. Composición vertical.
    ciclorama(NAR, "#C95C20")
    mt = mat("tin", TIN, 0.8); mc = mat("crema", CRE, 0.85); mp = mat("pap", BLA, 0.85); mo = mat("oli", OLI, 0.75)
    caja("cubo", (1.5, 1.5, 1.5), (-1.3, 0.2, 0.75), mt)
    cilindro(0.55, 2.6, (0.5, 0.6, 1.3), mc)
    esfera(0.62, (0.5, 0.6, 2.6 + 0.62), mp)
    cono(0.7, 1.4, (1.9, -0.3, 0), mt)
    esfera(0.22, (-0.4, -0.9, 0.22), mo)
    mundo(NAR, 0.35)
    sol(2.6, (math.radians(48), 0, math.radians(35)), 1.5)
    area(120, (-6, -5, 6), 6)
    foco_tel_off = 0.45
    camara((0.2, 0.3, 1.5), 16, 3.6, 55, 64)

elif ESC == 4:
    # PAPEL: composición mínima: arco tinta (el 6 abstracto), círculo naranja y triángulo oliva diminuto.
    ciclorama(PAP, "#EAE1D8")
    mt = mat("tin", TIN, 0.8); mn = mat("nar", NAR, 0.7); mo = mat("oli", OLI, 0.75); ms = mat("sun", SUN, 0.8)
    aro(1.25, 0.32, (-0.2, 0.4, 1.25 + 0.32), (math.radians(90), 0, 0), mt)
    esfera(0.6, (-0.2, 0.0, 0.6), mn)
    # triángulo: prisma de 3 lados
    bpy.ops.mesh.primitive_cylinder_add(vertices=3, radius=0.5, depth=0.35, location=(1.9, -0.6, 0.43), rotation=(math.radians(90), 0, math.radians(0)))
    t = bpy.context.object; t.rotation_euler = (math.radians(90), math.radians(-90), 0); suave(t); ponmat(t, mo)
    caja("losa", (1.8, 1.2, 0.18), (-2.6, -0.2, 0.09), ms)
    mundo(PAP, 0.35)
    sol(2.4, (math.radians(55), 0, math.radians(-30)), 1.6)
    area(110, (-5, -6, 5), 6)
    foco_tel_off = 0.45
    camara((0.0, 0.3, 1.35), 16, 3.4, 55, 64)

elif ESC == 5:
    # EL 6: el símbolo real de SEN6 en volumen, de pie sobre crema, con la esfera y el aro.
    ciclorama(CRE)
    mt = mat("tin", TIN, 0.75); mn = mat("nar", NAR, 0.6); mo = mat("oli", OLI, 0.75); ms = mat("sun", SUN, 0.8)
    antes = set(bpy.data.objects)
    bpy.ops.import_curve.svg(filepath=arg("--svg", os.path.join(os.path.dirname(os.path.abspath(__file__)), "sen6-simbolo-tech.svg")))
    nuevos = [o for o in bpy.data.objects if o not in antes and o.type == "CURVE"]
    for o in nuevos: o.select_set(True)
    bpy.context.view_layer.objects.active = nuevos[0]
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    # escala: el 6 mide ~3,6 de alto
    alto = max(o.dimensions.y for o in nuevos)
    k = 3.6 / alto
    cx = sum(o.location.x for o in nuevos) / len(nuevos); cy = min(o.location.y - o.dimensions.y / 2 for o in nuevos)
    for i, o in enumerate(nuevos):
        o.data.dimensions = "2D"; o.data.fill_mode = "BOTH"
        es_play = o.dimensions.y < alto * 0.5
        o.data.extrude = (0.42 if es_play else 0.32) / k
        o.data.bevel_depth = 0.025 / k; o.data.bevel_resolution = 3
        o.data.materials.clear(); o.data.materials.append(mn if es_play else mt)
        rel = (o.location.x - cx, o.location.y - cy)
        o.scale = (k, k, k)
        o.rotation_euler = (math.radians(90), 0, math.radians(-14))
        ang = math.radians(-14)
        x, z = rel[0] * k, rel[1] * k
        o.location = (0.2 + x * math.cos(ang), 0.4 + x * math.sin(ang) - (0.08 if es_play else 0), z)
    esfera(0.55, (-2.3, -0.6, 0.55), mn)
    aro(0.5, 0.12, (2.6, -0.4, 0.62), (math.radians(90), 0, math.radians(30)), mo)
    caja("losa", (1.6, 1.1, 0.16), (2.4, 0.6, 0.08), ms)
    mundo(CRE, 0.35)
    sol(2.6, (math.radians(50), 0, math.radians(-35)), 1.5)
    area(130, (-6, -6, 6), 6)
    foco_tel_off = 0.45
    camara((0.2, 0.3, 1.6), 16, 3.4, 55, 80)

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("OK", OUT)
