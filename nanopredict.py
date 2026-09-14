import bpy
import math

from mathutils import Vector

# ============================================================
# NanoPredict - Advanced Virtual Prototype
# ============================================================

# ---------- CLEAR SCENE ----------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for datablocks in (
    bpy.data.meshes,
    bpy.data.curves,
    bpy.data.materials,
    bpy.data.cameras,
    bpy.data.lights,
):
    pass


# ---------- MATERIALS ----------
def mat(name, color, metallic=0.0, roughness=0.4, transmission=0.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1.0)

    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")

    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness

        if "Transmission Weight" in bsdf.inputs:
            bsdf.inputs["Transmission Weight"].default_value = transmission

    return m


MAT_BASE = mat("Base Metal", (0.08, 0.09, 0.11), 0.75, 0.28)
MAT_METAL = mat("Precision Metal", (0.28, 0.30, 0.34), 0.85, 0.22)
MAT_RAIL = mat("Rail", (0.12, 0.14, 0.16), 0.9, 0.18)
MAT_BLACK = mat("Black", (0.015, 0.018, 0.022), 0.15, 0.25)
MAT_WHITE = mat("White", (0.7, 0.72, 0.75), 0.15, 0.3)
MAT_WAFER = mat("Silicon Wafer", (0.18, 0.22, 0.27), 0.7, 0.18)
MAT_GLASS = mat("Chamber Glass", (0.12, 0.3, 0.38), 0.05, 0.12, 0.35)
MAT_SENSOR = mat("Sensor Housing", (0.05, 0.07, 0.09), 0.5, 0.25)
MAT_RED = mat("Laser Red", (0.5, 0.005, 0.005), 0.1, 0.2)
MAT_GREEN = mat("Status Green", (0.01, 0.5, 0.04), 0.1, 0.25)
MAT_BLUE = mat("Display Blue", (0.02, 0.15, 0.7), 0.25, 0.2)
MAT_YELLOW = mat("Warning Yellow", (0.8, 0.45, 0.02), 0.1, 0.25)


# ---------- BASIC OBJECT FUNCTIONS ----------
def cube(name, loc, scale, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    if bevel > 0:
        mod = obj.modifiers.new("Edge Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3

    if material:
        obj.data.materials.append(material)

    return obj


def cylinder(name, loc, radius, depth, material, rotation=(0,0,0), vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=loc,
        rotation=rotation
    )
    obj = bpy.context.object
    obj.name = name

    if material:
        obj.data.materials.append(material)

    return obj


def text_obj(name, text, loc, size=0.35, material=MAT_WHITE):
    bpy.ops.object.text_add(location=loc, rotation=(math.radians(90), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = 'CENTER'
    obj.data.size = size
    obj.data.extrude = 0.015

    if material:
        obj.data.materials.append(material)

    return obj


# ============================================================
# 1. MAIN BASE
# ============================================================

base = cube(
    "MAIN_BASE",
    (0, 0, 0),
    (14, 9, 0.6),
    MAT_BASE,
    0.18
)

# Raised mounting plate
mount = cube(
    "PRECISION_MOUNT",
    (0, 0, 0.42),
    (12.5, 7.5, 0.25),
    MAT_METAL,
    0.08
)


# ============================================================
# 2. LINEAR RAIL SYSTEM
# ============================================================

for y, name in [(1.8, "LINEAR_RAIL_01"), (-1.8, "LINEAR_RAIL_02")]:
    cylinder(
        name,
        (0, y, 0.78),
        0.14,
        11.5,
        MAT_RAIL,
        rotation=(0, math.radians(90), 0)
    )

    # rail supports
    for x in (-4.5, 0, 4.5):
        cylinder(
            name + "_SUPPORT",
            (x, y, 0.62),
            0.22,
            0.25,
            MAT_METAL
        )


# ============================================================
# 3. MOVING CARRIAGE
# ============================================================

carriage = cube(
    "MOVING_CARRIAGE",
    (0, 0, 1.02),
    (4.8, 4.7, 0.38),
    MAT_METAL,
    0.12
)

# carriage top
cube(
    "STAGE_TOP",
    (0, 0, 1.27),
    (4.1, 4.0, 0.18),
    MAT_BLACK,
    0.08
)


# ============================================================
# 4. WAFER
# ============================================================

cylinder(
    "SILICON_WAFER",
    (0, 0, 1.48),
    1.65,
    0.10,
    MAT_WAFER,
    vertices=96
)

# wafer rim
cylinder(
    "WAFER_RIM",
    (0, 0, 1.535),
    1.68,
    0.025,
    MAT_METAL,
    vertices=96
)


# ============================================================
# 5. LEAD SCREW
# ============================================================

cylinder(
    "LEAD_SCREW",
    (0, 0, 0.68),
    0.09,
    11.8,
    MAT_METAL,
    rotation=(0, math.radians(90), 0),
    vertices=32
)

# screw collar
for x in (-5.3, 5.3):
    cylinder(
        "SCREW_COLLAR",
        (x, 0, 0.68),
        0.20,
        0.28,
        MAT_BLACK,
        rotation=(0, math.radians(90), 0)
    )


# ============================================================
# 6. MOTOR
# ============================================================

motor_body = cylinder(
    "STEPPER_MOTOR",
    (-6.1, 0, 0.9),
    0.65,
    1.1,
    MAT_BLACK,
    rotation=(0, math.radians(90), 0)
)

# motor front
cylinder(
    "MOTOR_SHAFT",
    (-5.45, 0, 0.9),
    0.16,
    0.55,
    MAT_METAL,
    rotation=(0, math.radians(90), 0)
)

# motor mounting plate
cube(
    "MOTOR_MOUNT",
    (-5.85, 0, 0.9),
    (0.25, 2.0, 1.7),
    MAT_METAL,
    0.08
)


# ============================================================
# 7. LASER DISPLACEMENT SENSOR
# ============================================================

laser_mount = cube(
    "LASER_MOUNT",
    (3.5, 0, 4.5),
    (1.2, 1.3, 0.35),
    MAT_METAL,
    0.08
)

laser_body = cube(
    "LASER_SENSOR",
    (3.5, 0, 4.0),
    (0.8, 0.8, 0.8),
    MAT_SENSOR,
    0.12
)

# laser emitter
cylinder(
    "LASER_EMITTER",
    (3.5, 0, 3.55),
    0.16,
    0.25,
    MAT_RED
)

# visible laser beam
beam = cylinder(
    "LASER_BEAM",
    (3.5, 0, 2.75),
    0.025,
    1.5,
    MAT_RED
)


# ============================================================
# 8. VIBRATION SENSOR / MPU
# ============================================================

mpu = cube(
    "MPU6050_VIBRATION_SENSOR",
    (0.8, 1.0, 1.62),
    (0.65, 0.65, 0.16),
    MAT_SENSOR,
    0.04
)

text_obj(
    "MPU_LABEL",
    "MPU",
    (0.8, 1.0, 1.72),
    0.20,
    MAT_WHITE
)


# ============================================================
# 9. TEMPERATURE / HUMIDITY SENSOR
# ============================================================

temp_sensor = cube(
    "TEMP_HUMIDITY_SENSOR",
    (-2.8, -3.1, 1.2),
    (0.8, 0.5, 0.9),
    MAT_SENSOR,
    0.08
)

text_obj(
    "TEMP_LABEL",
    "TEMP / RH",
    (-2.8, -3.1, 1.68),
    0.18,
    MAT_WHITE
)


# ============================================================
# 10. VACUUM SENSOR
# ============================================================

vac_sensor = cylinder(
    "VACUUM_SENSOR",
    (4.5, 2.9, 2.0),
    0.35,
    0.5,
    MAT_SENSOR,
    rotation=(math.radians(90), 0, 0)
)

text_obj(
    "VACUUM_LABEL",
    "VACUUM",
    (4.5, 2.9, 2.35),
    0.18,
    MAT_WHITE
)


# ============================================================
# 11. CHAMBER FRAME
# ============================================================

# Four vertical corner posts
for x in (-5.7, 5.7):
    for y in (-3.5, 3.5):
        cube(
            "CHAMBER_POST",
            (x, y, 2.7),
            (0.22, 0.22, 4.2),
            MAT_METAL,
            0.04
        )

# transparent side panels
cube(
    "CHAMBER_FRONT_GLASS",
    (0, -3.5, 2.7),
    (11.4, 0.08, 4.1),
    MAT_GLASS,
    0.02
)

cube(
    "CHAMBER_BACK_GLASS",
    (0, 3.5, 2.7),
    (11.4, 0.08, 4.1),
    MAT_GLASS,
    0.02
)

cube(
    "CHAMBER_LEFT_GLASS",
    (-5.7, 0, 2.7),
    (0.08, 7.0, 4.1),
    MAT_GLASS,
    0.02
)

cube(
    "CHAMBER_RIGHT_GLASS",
    (5.7, 0, 2.7),
    (0.08, 7.0, 4.1),
    MAT_GLASS,
    0.02
)

# chamber roof
cube(
    "CHAMBER_ROOF",
    (0, 0, 4.78),
    (11.6, 7.2, 0.18),
    MAT_METAL,
    0.05
)


# ============================================================
# 12. CONTROLLER / ELECTRONICS BOX
# ============================================================

controller = cube(
    "CONTROLLER_BOX",
    (-3.8, -5.0, 1.4),
    (4.5, 1.5, 2.0),
    MAT_BLACK,
    0.15
)

# controller front panel
cube(
    "CONTROLLER_PANEL",
    (-3.8, -5.78, 1.45),
    (3.9, 0.08, 1.5),
    MAT_SENSOR,
    0.03
)

text_obj(
    "CONTROLLER_LABEL",
    "NanoPredict Controller",
    (-3.8, -5.84, 1.65),
    0.28,
    MAT_WHITE
)


# ============================================================
# 13. STATUS INDICATORS
# ============================================================

for i, material in enumerate([MAT_GREEN, MAT_BLUE, MAT_YELLOW]):
    cylinder(
        "STATUS_LED",
        (-5.0 + i * 1.0, -5.86, 1.05),
        0.13,
        0.08,
        material,
        rotation=(math.radians(90), 0, 0)
    )


# ============================================================
# 14. CABLES
# ============================================================

def cable(name, a, b, radius=0.045, material=MAT_BLACK):
    a = Vector(a)
    b = Vector(b)
    mid = (a + b) / 2
    direction = b - a
    length = direction.length

    obj = cylinder(
        name,
        mid,
        radius,
        length,
        material,
        vertices=16
    )

    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = direction.to_track_quat('Z', 'Y')

    return obj


cable("LASER_CABLE", (3.5, 0, 3.6), (3.5, 2.8, 2.0))
cable("MPU_CABLE", (0.8, 1.0, 1.6), (-1.0, 2.8, 1.0))
cable("TEMP_CABLE", (-2.8, -3.1, 1.2), (-2.8, -4.5, 1.3))
cable("VACUUM_CABLE", (4.5, 2.9, 2.0), (4.5, 4.2, 2.0))


# ============================================================
# 15. LABELS
# ============================================================

text_obj(
    "TITLE",
    "NanoPredict - Advanced Precision Monitoring Prototype",
    (0, -4.65, 0.78),
    0.34,
    MAT_WHITE
)

text_obj(
    "WAFER_LABEL",
    "WAFER",
    (0, 0, 1.61),
    0.25,
    MAT_WHITE
)

text_obj(
    "LASER_LABEL",
    "LASER DISPLACEMENT",
    (3.5, -0.8, 4.35),
    0.20,
    MAT_WHITE
)


# ============================================================
# 16. CAMERA
# ============================================================

bpy.ops.object.camera_add(
    location=(16, -18, 13)
)

camera = bpy.context.object
camera.name = "MAIN_CAMERA"

def point_camera(cam, target):
    direction = Vector(target) - cam.location
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

point_camera(camera, (0, 0, 1.8))

bpy.context.scene.camera = camera


# ============================================================
# 17. LIGHTING
# ============================================================

bpy.ops.object.light_add(
    type='AREA',
    location=(2, -6, 12)
)

key = bpy.context.object
key.name = "KEY_LIGHT"
key.data.energy = 1500
key.data.shape = 'DISK'
key.data.size = 7

point_camera(key, (0, 0, 1.5))


bpy.ops.object.light_add(
    type='AREA',
    location=(-10, 3, 7)
)

fill = bpy.context.object
fill.name = "FILL_LIGHT"
fill.data.energy = 900
fill.data.size = 6

point_camera(fill, (0, 0, 2))


bpy.ops.object.light_add(
    type='AREA',
    location=(8, 8, 6)
)

rim = bpy.context.object
rim.name = "RIM_LIGHT"
rim.data.energy = 1100
rim.data.size = 5

point_camera(rim, (0, 0, 2))


# ============================================================
# 18. WORLD
# ============================================================

world = bpy.context.scene.world

if world:
    world.color = (0.015, 0.018, 0.025)

    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")

    if bg:
        bg.inputs["Color"].default_value = (0.008, 0.012, 0.02, 1)
        bg.inputs["Strength"].default_value = 0.25


# ============================================================
# 19. RENDER SETTINGS
# ============================================================

scene = bpy.context.scene

scene.render.engine='BLENDER_EEVEE'

scene.render.resolution_x = 1200
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100

scene.render.image_settings.file_format = 'PNG'

scene.render.filepath = "/home/asus_sharanugowda/NanoPredict/nanopredict_advanced.png"

# Slightly nicer viewport/render settings
scene.render.film_transparent = False


# ============================================================
# 20. SAVE
# ============================================================

bpy.ops.wm.save_as_mainfile(
    filepath="/home/asus_sharanugowda/NanoPredict/NanoPredict_Advanced.blend"
)

# Render first image
bpy.ops.render.render(write_still=True)

print("==========================================")
print(" NanoPredict Advanced Prototype Created ")
print("==========================================")
print("Blend file:")
print("~/NanoPredict/NanoPredict_Advanced.blend")
print("")
print("Render:")
print("~/NanoPredict/nanopredict_advanced.png")
print("==========================================")
