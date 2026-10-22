"""
MediPulse HMS — HCI Project Presentation Generator
Generates a professional PowerPoint presentation with all HCI principles applied.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import copy

# ─────────────────────────────────────────────
# COLOUR PALETTE  (clinical blue + clean white)
# ─────────────────────────────────────────────
C_DARK_BLUE  = RGBColor(0x02, 0x84, 0xC7)   # primary-600
C_NAVY       = RGBColor(0x03, 0x69, 0xA1)   # primary-700
C_LIGHT_BLUE = RGBColor(0xE0, 0xF2, 0xFE)   # primary-100
C_WHITE      = RGBColor(0xFF, 0xFF, 0xFF)
C_DARK       = RGBColor(0x0F, 0x17, 0x2A)   # slate-900
C_GRAY       = RGBColor(0x47, 0x55, 0x69)   # slate-600
C_LIGHT_GRAY = RGBColor(0xF1, 0xF5, 0xF9)   # slate-100
C_EMERALD    = RGBColor(0x05, 0x96, 0x69)   # emerald-600
C_AMBER      = RGBColor(0xD9, 0x77, 0x06)   # amber-600
C_ROSE       = RGBColor(0xE1, 0x1D, 0x48)   # rose-600
C_ACCENT     = RGBColor(0x06, 0xB6, 0xD4)   # cyan-500

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

BLANK = prs.slide_layouts[6]   # completely blank layout

# ─────────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────────

def add_rect(slide, l, t, w, h, fill=None, line=None, line_w=None):
    shape = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.line.fill.background()
    if fill:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill
    else:
        shape.fill.background()
    if line:
        shape.line.color.rgb = line
        if line_w:
            shape.line.width = Pt(line_w)
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, l, t, w, h,
             size=18, bold=False, color=None, align=PP_ALIGN.LEFT,
             italic=False, wrap=True):
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txb.word_wrap = wrap
    tf  = txb.text_frame
    tf.word_wrap = wrap
    p   = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.italic = italic
    run.font.color.rgb = color or C_DARK
    return txb

def add_para(tf, text, size=14, bold=False, color=None,
             align=PP_ALIGN.LEFT, italic=False, space_before=0):
    p = tf.add_paragraph()
    p.alignment = align
    p.space_before = Pt(space_before)
    run = p.add_run()
    run.text = text
    run.font.size  = Pt(size)
    run.font.bold  = bold
    run.font.italic = italic
    run.font.color.rgb = color or C_DARK
    return p

def add_textbox_multi(slide, lines, l, t, w, h, default_size=13):
    """lines = list of (text, size, bold, color, align, italic)"""
    txb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txb.word_wrap = True
    tf = txb.text_frame
    tf.word_wrap = True
    first = True
    for item in lines:
        text  = item[0]
        size  = item[1] if len(item) > 1 else default_size
        bold  = item[2] if len(item) > 2 else False
        color = item[3] if len(item) > 3 else C_DARK
        align = item[4] if len(item) > 4 else PP_ALIGN.LEFT
        italic= item[5] if len(item) > 5 else False
        if first:
            p = tf.paragraphs[0]
            first = False
        else:
            p = tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = text
        run.font.size  = Pt(size)
        run.font.bold  = bold
        run.font.italic = italic
        run.font.color.rgb = color
    return txb

def slide_header(slide, title, subtitle=None, accent_bar=True):
    """Adds the standard top header bar used on content slides."""
    # Top accent bar
    if accent_bar:
        add_rect(slide, 0, 0, 13.33, 0.08, fill=C_DARK_BLUE)
    # Title
    add_text(slide, title, 0.45, 0.18, 9, 0.55,
             size=24, bold=True, color=C_DARK)
    if subtitle:
        add_text(slide, subtitle, 0.45, 0.72, 9, 0.35,
                 size=13, color=C_GRAY, italic=True)
    # Slide logo mark
    add_rect(slide, 11.8, 0.15, 1.3, 0.6, fill=C_DARK_BLUE)
    add_text(slide, "MediPulse HMS", 11.82, 0.22, 1.28, 0.45,
             size=9, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

def pill_box(slide, label, l, t, w=1.9, h=0.38,
             bg=C_LIGHT_BLUE, fg=C_DARK_BLUE):
    add_rect(slide, l, t, w, h, fill=bg)
    add_text(slide, label, l+0.05, t+0.04, w-0.1, h-0.08,
             size=10, bold=True, color=fg, align=PP_ALIGN.CENTER)

def divider(slide, t, color=C_LIGHT_GRAY):
    add_rect(slide, 0.45, t, 12.4, 0.025, fill=color)

# ══════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE SLIDE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)

# Full background gradient simulation with two rects
add_rect(s, 0, 0, 13.33, 7.5, fill=C_NAVY)
add_rect(s, 0, 0, 6.2,   7.5, fill=C_DARK_BLUE)

# Decorative circles
for cx, cy, cw in [(10.5, 5.5, 4), (11.5, 1.5, 3), (1, 6.5, 2.5)]:
    shape = s.shapes.add_shape(9,  # oval
        Inches(cx), Inches(cy), Inches(cw), Inches(cw))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(0x07, 0x59, 0x85)
    shape.line.fill.background()

# Hospital cross icon area
add_rect(s, 0.6, 1.2, 0.7, 0.18, fill=C_WHITE)
add_rect(s, 0.87, 0.95, 0.18, 0.68, fill=C_WHITE)

# Left content
add_text(s, "MediPulse HMS", 0.45, 1.9, 5.8, 1.0,
         size=40, bold=True, color=C_WHITE)
add_text(s, "Hospital Management System", 0.45, 2.88, 5.8, 0.5,
         size=18, color=RGBColor(0xBA,0xE6,0xFD))
add_rect(s, 0.45, 3.45, 2.5, 0.04, fill=RGBColor(0xBA,0xE6,0xFD))

add_text(s, "HCI Project — Practical Application of", 0.45, 3.65, 5.8, 0.45,
         size=14, color=C_WHITE)
add_text(s, "Human-Computer Interaction Principles", 0.45, 4.05, 5.8, 0.45,
         size=14, color=C_WHITE)

add_text(s, "Subject: BCSE415L — Human-Computer Interaction", 0.45, 4.75, 5.8, 0.4,
         size=12, color=RGBColor(0xBA,0xE6,0xFD))

# Right panel — key facts
add_rect(s, 6.8, 1.3, 6.0, 5.0, fill=RGBColor(0xFF,0xFF,0xFF))

facts = [
    ("🏥  Project",       "MediPulse HMS"),
    ("⚙️  Stack",         "React + Vite + Express.js"),
    ("👥  User Roles",    "Patient • Doctor • Admin"),
    ("📚  HCI Concepts",  "14 Principles Applied"),
    ("📝  Files Modified","11 Source Files"),
    ("✅  Tests Passed",  "All API & UI Verified"),
]
for i, (label, val) in enumerate(facts):
    ty = 1.55 + i * 0.72
    add_rect(s, 7.0, ty, 5.6, 0.58, fill=C_LIGHT_GRAY)
    add_text(s, label, 7.1, ty+0.08, 2.2, 0.42, size=10, bold=True, color=C_GRAY)
    add_text(s, val,   9.2, ty+0.08, 3.3, 0.42, size=11, bold=True, color=C_DARK_BLUE)

# Bottom tag
add_rect(s, 0, 7.0, 13.33, 0.5, fill=RGBColor(0x02,0x4D,0x78))
add_text(s, "BCSE415L  |  HCI Course Project  |  MediPulse Hospital Management System",
         0.3, 7.05, 12.7, 0.38, size=10, color=C_WHITE, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 2 — PROJECT OVERVIEW
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Project Overview", "What is MediPulse HMS?")
divider(s, 1.12)

# Left: description
add_textbox_multi(s, [
    ("MediPulse HMS", 17, True, C_DARK_BLUE),
    ("", 6),
    ("A full-stack, multi-role Hospital Management System", 13, False, C_DARK),
    ("built with React 19 + Vite (frontend) and Express.js", 13, False, C_DARK),
    ("(backend), featuring three distinct role-based portals.", 13, False, C_DARK),
], 0.45, 1.25, 5.6, 1.6)

# Role cards
roles = [
    ("🩺  Patient Portal", "Book appointments\nView records & bills\nAccess prescriptions", C_LIGHT_BLUE, C_DARK_BLUE),
    ("⚕️  Doctor Portal",  "Manage schedule\nPatient EHR access\nLab orders & Rx",    RGBColor(0xD1,0xFA,0xE5), C_EMERALD),
    ("🛡️  Admin Portal",   "Manage all staff\nBeds, billing, reports\nSystem settings",  RGBColor(0xFF,0xFB,0xEB), C_AMBER),
]
for i, (title, body, bg, fg) in enumerate(roles):
    lx = 0.45 + i * 4.26
    add_rect(s, lx, 2.5, 4.0, 2.4, fill=bg)
    add_rect(s, lx, 2.5, 4.0, 0.5, fill=fg)
    add_text(s, title, lx+0.12, 2.55, 3.8, 0.4, size=12, bold=True, color=C_WHITE)
    add_text(s, body,  lx+0.15, 3.08, 3.7, 1.7, size=11, color=C_DARK)

# Tech stack bar
add_rect(s, 0.45, 5.15, 12.4, 0.65, fill=C_LIGHT_GRAY)
techs = ["React 19", "Vite 8", "Express.js 4", "JWT Auth", "Lucide Icons", "Vanilla CSS"]
for i, t in enumerate(techs):
    pill_box(s, t, 0.6 + i*2.05, 5.28, 1.85, 0.38)

add_text(s, "Technology Stack", 0.45, 5.05, 4, 0.3, size=10, bold=True, color=C_GRAY)

# HCI goal box
add_rect(s, 0.45, 6.0, 12.4, 0.95, fill=C_DARK_BLUE)
add_text(s, "🎯  HCI Goal:  Identify usability problems in the existing interface and apply course-taught principles "
            "(Shneiderman, Nielsen, Fitts, Norman, Gestalt) to make targeted, meaningful improvements.",
         0.65, 6.08, 12.0, 0.8, size=12, color=C_WHITE)

# ══════════════════════════════════════════════════════════════
# SLIDE 3 — HCI CONCEPTS OVERVIEW
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "HCI Concepts Applied", "All principles sourced from course materials — BCSE415L")
divider(s, 1.12)

concepts = [
    ("Shneiderman's\n8 Golden Rules",  "Rules 2, 4, 6, 8\napplied across\n5 components",  C_DARK_BLUE,  C_LIGHT_BLUE),
    ("Fitts's Law",                    "Target size &\nplacement for\nfaster clicks",       C_EMERALD,    RGBColor(0xD1,0xFA,0xE5)),
    ("Nielsen's 10\nHeuristics",       "H1, H3, H5, H6\napplied to\nforms & feedback",     C_AMBER,      RGBColor(0xFF,0xFB,0xEB)),
    ("Norman's Design\nPrinciples",    "Affordance,\nFeedback &\nSignifiers applied",       C_ROSE,       RGBColor(0xFF,0xF1,0xF2)),
    ("Gestalt\nPrinciples",            "Figure-ground\nfor empty states\n& grouping",       RGBColor(0x4F,0x46,0xE5), RGBColor(0xEE,0xF2,0xFF)),
    ("WCAG 2.1 AA\nAccessibility",     "Focus rings,\nARIA attributes,\nScreen readers",    RGBColor(0x0D,0x94,0x88), RGBColor(0xCC,0xFB,0xF1)),
]
for i, (name, desc, fg, bg) in enumerate(concepts):
    col = i % 3
    row = i // 3
    lx = 0.45 + col * 4.27
    ty = 1.3  + row * 2.7
    add_rect(s, lx, ty, 4.0, 2.4, fill=bg)
    add_rect(s, lx, ty, 4.0, 0.06, fill=fg)
    add_text(s, name, lx+0.18, ty+0.18, 3.7, 0.75, size=13, bold=True, color=fg)
    add_text(s, desc, lx+0.18, ty+0.95, 3.7, 1.3,  size=11, color=C_DARK)

add_rect(s, 0, 7.1, 13.33, 0.4, fill=C_LIGHT_GRAY)
add_text(s, "14 distinct usability problems identified and resolved  •  11 files modified  •  All changes verified",
         0.3, 7.15, 12.7, 0.3, size=10, color=C_GRAY, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 4 — SHNEIDERMAN'S 8 GOLDEN RULES
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Shneiderman's Eight Golden Rules", "Applied to MediPulse HMS — Module 1 Course Material")
divider(s, 1.12)

rules = [
    ("Rule 1", "Strive for consistency",        "✅ Consistent button styles, colours & labels throughout all 3 portals", True),
    ("Rule 2", "Offer informative feedback",     "✅ Loading spinner on demo login • Toast notifications for every action", True),
    ("Rule 3", "Design dialogs for closure",     "✅ Confirmation modal shows consequences before destructive action completes", True),
    ("Rule 4", "Prevent errors",                 "✅ Sign Out confirmation • Doctor Deactivation modal • Form validation", True),
    ("Rule 5", "Allow reversal of actions",      "✅ Cancel button in every confirmation dialog • Safe exits provided", True),
    ("Rule 6", "Reduce memory load",             "✅ Inline error messages • Required-field legend • Input format hints", True),
    ("Rule 7", "Support internal locus of control", "✅ Role switcher • Settings panel • User controls their own workflow", True),
    ("Rule 8", "Reduce short-term memory load",  "✅ Empty-state UI • Consistent icons • Recognition over recall patterns", True),
]

for i, (num, rule, impl, applied) in enumerate(rules):
    col = i % 2
    row = i // 2
    lx = 0.45 + col * 6.4
    ty = 1.25 + row * 1.45

    bg = C_LIGHT_BLUE if applied else C_LIGHT_GRAY
    add_rect(s, lx, ty, 6.1, 1.28, fill=bg)
    add_rect(s, lx, ty, 0.55, 1.28, fill=C_DARK_BLUE)
    add_text(s, num, lx+0.02, ty+0.38, 0.55, 0.5, size=9, bold=True,
             color=C_WHITE, align=PP_ALIGN.CENTER)

    add_text(s, rule, lx+0.65, ty+0.08, 5.3, 0.42, size=12, bold=True, color=C_DARK)
    add_text(s, impl, lx+0.65, ty+0.52, 5.3, 0.68, size=10, color=C_GRAY)

add_rect(s, 0, 7.1, 13.33, 0.4, fill=C_DARK_BLUE)
add_text(s, "All 8 Golden Rules have been addressed in the MediPulse HMS codebase",
         0.3, 7.15, 12.7, 0.3, size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 5 — FITTS'S LAW
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Fitts's Law", "Movement time to a target depends on its size and distance — Module 2")
divider(s, 1.12)

# Definition box
add_rect(s, 0.45, 1.25, 12.4, 1.0, fill=C_LIGHT_BLUE)
add_textbox_multi(s, [
    ("Definition:  ", 13, True, C_DARK_BLUE),
], 0.6, 1.35, 2.0, 0.7)
add_textbox_multi(s, [
    ("The time to acquire a target is a function of the distance to the target and the size of the target.", 13, False, C_DARK),
    ("T = a + b × log₂(2D/W)     →     Larger targets = Faster clicks = Better usability", 12, True, C_DARK_BLUE),
], 2.5, 1.32, 10.2, 0.9)

# Before / After comparison
add_text(s, "Before vs. After — Sidebar Collapse Button", 0.45, 2.45, 12, 0.4,
         size=14, bold=True, color=C_DARK)
divider(s, 2.85, C_LIGHT_GRAY)

# BEFORE
add_rect(s, 0.45, 3.0, 5.8, 2.8, fill=RGBColor(0xFF,0xF1,0xF2))
add_rect(s, 0.45, 3.0, 5.8, 0.42, fill=C_ROSE)
add_text(s, "❌  BEFORE", 0.6, 3.05, 5.5, 0.34, size=13, bold=True, color=C_WHITE)

add_rect(s, 2.0, 3.65, 0.70, 0.70, fill=RGBColor(0xCB,0xD5,0xE1))
add_text(s, "◀", 2.0, 3.72, 0.70, 0.56, size=16, bold=True, color=C_GRAY, align=PP_ALIGN.CENTER)

add_textbox_multi(s, [
    ("Button size: 28 × 28 px", 12, True, C_ROSE),
    ("", 4),
    ("• Too small for reliable clicking", 11, False, C_DARK),
    ("• Easy to miss-click on adjacent items", 11, False, C_DARK),
    ("• Violates Fitts's Law — small target", 11, False, C_DARK),
    ("  increases acquisition time", 11, False, C_DARK),
], 0.65, 4.42, 5.4, 1.3)

# Arrow
add_text(s, "→", 6.5, 4.1, 0.7, 0.7, size=30, bold=True, color=C_DARK_BLUE, align=PP_ALIGN.CENTER)

# AFTER
add_rect(s, 7.1, 3.0, 5.8, 2.8, fill=RGBColor(0xEC,0xFD,0xF5))
add_rect(s, 7.1, 3.0, 5.8, 0.42, fill=C_EMERALD)
add_text(s, "✅  AFTER", 7.25, 3.05, 5.5, 0.34, size=13, bold=True, color=C_WHITE)

add_rect(s, 8.55, 3.6, 0.84, 0.84, fill=RGBColor(0xD1,0xFA,0xE5))
add_text(s, "◀", 8.55, 3.68, 0.84, 0.68, size=20, bold=True, color=C_EMERALD, align=PP_ALIGN.CENTER)

add_textbox_multi(s, [
    ("Button size: 38 × 38 px  (+36% larger)", 12, True, C_EMERALD),
    ("", 4),
    ("• Larger target = faster acquisition", 11, False, C_DARK),
    ("• Fewer miss-clicks on frequently-used control", 11, False, C_DARK),
    ("• Directly applies Fitts's Law principle", 11, False, C_DARK),
    ("  from course Module 2", 11, False, C_DARK),
], 7.25, 4.42, 5.55, 1.3)

add_rect(s, 0, 7.1, 13.33, 0.4, fill=C_LIGHT_GRAY)
add_text(s, "Code change:  style={{ width: 28, height: 28 }}  →  style={{ width: 38, height: 38 }}   in Sidebar.jsx",
         0.3, 7.13, 12.7, 0.32, size=10, color=C_GRAY, align=PP_ALIGN.CENTER, italic=True)

# ══════════════════════════════════════════════════════════════
# SLIDE 6 — NIELSEN'S USABILITY HEURISTICS
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Nielsen's Usability Heuristics", "10 Heuristics — 4 Applied to MediPulse HMS — Module 3")
divider(s, 1.12)

heuristics = [
    ("H1", "Visibility of\nSystem Status",
     "Problem: Demo login buttons gave no\nfeedback when clicked.",
     "Fix: Loading spinner appears on the\nclicked button for 600ms, confirming\nthe system is processing.",
     C_DARK_BLUE, C_LIGHT_BLUE),

    ("H3", "User Control\n& Freedom",
     "Problem: Sign Out and Doctor\nDeactivate had no cancel option.",
     "Fix: Confirmation dialogs with clear\nCancel button — users can always\nescape accidental actions.",
     C_EMERALD, RGBColor(0xD1,0xFA,0xE5)),

    ("H5", "Error\nPrevention",
     "Problem: Registration form accepted\nany input without checking.",
     "Fix: Per-field validation runs as you\ntype. Invalid fields highlighted in red\nbefore submission is allowed.",
     C_AMBER, RGBColor(0xFF,0xFB,0xEB)),

    ("H6", "Recognition\nnot Recall",
     "Problem: Empty search results showed\nblank white space — confusing.",
     "Fix: Contextual empty-state UI with\nicon, message, and 'Clear Filters'\nbutton — no guesswork needed.",
     C_ROSE, RGBColor(0xFF,0xF1,0xF2)),
]

for i, (code, name, prob, fix, fg, bg) in enumerate(heuristics):
    lx = 0.45 + i * 3.2
    ty = 1.3
    add_rect(s, lx, ty, 3.0, 5.7, fill=bg)
    add_rect(s, lx, ty, 3.0, 0.55, fill=fg)
    add_text(s, code, lx+0.08, ty+0.08, 0.6, 0.4, size=12, bold=True, color=C_WHITE)
    add_text(s, name, lx+0.65, ty+0.06, 2.25, 0.46, size=11, bold=True, color=C_WHITE)

    add_text(s, "Problem:", lx+0.15, ty+0.7, 2.7, 0.3, size=10, bold=True, color=fg)
    add_text(s, prob, lx+0.15, ty+1.0, 2.75, 1.1, size=10, color=C_DARK)

    add_rect(s, lx+0.1, ty+2.15, 2.8, 0.025, fill=fg)

    add_text(s, "Solution:", lx+0.15, ty+2.3, 2.7, 0.3, size=10, bold=True, color=fg)
    add_text(s, fix, lx+0.15, ty+2.6, 2.75, 1.3, size=10, color=C_DARK)

    add_text(s, "✅ Applied", lx+0.15, ty+4.95, 2.7, 0.35,
             size=10, bold=True, color=fg, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 7 — NORMAN'S DESIGN PRINCIPLES
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Norman's Design Principles", "Affordance • Feedback • Signifiers • Conceptual Models — Module 1")
divider(s, 1.12)

normans = [
    ("Affordance",        "Controls should look like what they do.",
     "Password field had no visual cue\nthat it could reveal its content.",
     "Eye icon toggle added to the\npassword field — clicking it\nreveals/hides the typed text.",
     "👁",  C_DARK_BLUE),

    ("Feedback",          "The system must communicate the result of every action.",
     "Form inputs all looked the same\nwhether valid or invalid.",
     "Colour-coded borders:\nRed border = invalid field\nGreen border = valid field",
     "🎨", C_EMERALD),

    ("Signifiers",        "Mark where actions should occur.",
     "No indication of which fields\nwere required on the sign-up form.",
     "Asterisk (*) added on each\nrequired label + legend:\n'Fields marked * are required'",
     "✳", C_AMBER),

    ("Conceptual\nModels", "Colour must match user's mental model.",
     "Deactivate button was red — even\nbefore the final confirmation step.",
     "Changed to amber (caution) before\nconfirmation; red only on the final\ndestructive confirm button.",
     "🚦", C_ROSE),
]

for i, (principle, defn, prob, fix, icon, fg) in enumerate(normans):
    col = i % 2
    row = i // 2
    lx = 0.45 + col * 6.4
    ty = 1.28 + row * 2.8

    add_rect(s, lx, ty, 6.1, 2.55, fill=C_LIGHT_GRAY)
    add_rect(s, lx, ty, 0.62, 2.55, fill=fg)
    add_text(s, icon, lx+0.02, ty+0.85, 0.62, 0.7, size=22, align=PP_ALIGN.CENTER, color=C_WHITE)

    add_text(s, principle, lx+0.75, ty+0.1,  5.2, 0.45, size=13, bold=True, color=fg)
    add_text(s, defn,      lx+0.75, ty+0.52, 5.2, 0.38, size=10, italic=True, color=C_GRAY)

    add_rect(s, lx+0.7, ty+0.95, 5.25, 0.02, fill=RGBColor(0xCB,0xD5,0xE1))

    add_text(s, "Before: " + prob, lx+0.75, ty+1.05, 2.3, 1.35, size=10, color=C_DARK)
    add_rect(s, lx+3.12, ty+1.0, 0.02, 1.4, fill=RGBColor(0xCB,0xD5,0xE1))
    add_text(s, "After: "  + fix,  lx+3.2,  ty+1.05, 2.75, 1.35, size=10, color=C_DARK)

# ══════════════════════════════════════════════════════════════
# SLIDE 8 — ACCESSIBILITY & GESTALT
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Accessibility & Gestalt Principles", "WCAG 2.1 AA  •  Figure-Ground  •  Proximity  •  Similarity")
divider(s, 1.12)

# Left: Accessibility
add_rect(s, 0.45, 1.28, 6.1, 5.9, fill=C_LIGHT_BLUE)
add_rect(s, 0.45, 1.28, 6.1, 0.48, fill=C_DARK_BLUE)
add_text(s, "♿  WCAG 2.1 AA Accessibility Improvements", 0.6, 1.32, 5.8, 0.4,
         size=12, bold=True, color=C_WHITE)

acc_items = [
    ("Focus Ring on All Buttons",    "Tab through any element — a clear\n3px blue outline ring appears.\nKeyboard users can always see focus."),
    ("ARIA on Modal Dialogs",        "aria-labelledby, aria-modal, role=dialog\nadded to all Modal components so\nscreen readers describe the dialog."),
    ("Focus Trap in Modals",         "Tab key cycles only within the open\ndialog — users cannot accidentally\nreach background content."),
    ("aria-current='page' on Nav",   "Active sidebar item is announced\nby screen readers as 'current page'."),
    ("aria-live Toast Announcements","Notifications are read aloud by\nscreen readers when they appear."),
]
for i, (title, desc) in enumerate(acc_items):
    ty = 1.9 + i * 0.98
    add_rect(s, 0.6, ty, 5.8, 0.85, fill=C_WHITE)
    add_text(s, "✅  " + title, 0.72, ty+0.05, 5.5, 0.35, size=11, bold=True, color=C_DARK_BLUE)
    add_text(s, desc,           0.72, ty+0.38, 5.5, 0.45, size=9,  color=C_GRAY)

# Right: Gestalt
add_rect(s, 6.78, 1.28, 6.1, 5.9, fill=RGBColor(0xEE,0xF2,0xFF))
add_rect(s, 6.78, 1.28, 6.1, 0.48, fill=RGBColor(0x4F,0x46,0xE5))
add_text(s, "🔷  Gestalt Principles Applied", 6.92, 1.32, 5.8, 0.4,
         size=12, bold=True, color=C_WHITE)

gestalt_items = [
    ("Figure-Ground", "Empty search state",
     "When no doctors match a filter, a distinct\nempty-state UI (icon + message + button)\nclearly separates 'no data' from the background."),
    ("Proximity",      "Form field grouping",
     "Related fields (Name+Email, Age+Gender)\nare grouped in a 2-column grid so users\nperceive them as logically connected."),
    ("Similarity",     "Badge colour coding",
     "All success states use green, warning\nstates use amber, and errors use red —\ncreating a consistent visual language."),
    ("Common Region",  "Card containers",
     "Each stat card, modal section, and\nform group is enclosed in a bordered\ncontainer to signal a distinct region."),
]
for i, (principle, where, desc) in enumerate(gestalt_items):
    ty = 1.9 + i * 1.22
    add_rect(s, 6.92, ty, 5.8, 1.08, fill=C_WHITE)
    add_text(s, principle, 7.05, ty+0.05, 2.0, 0.35, size=11, bold=True, color=RGBColor(0x4F,0x46,0xE5))
    add_text(s, "— " + where, 9.0, ty+0.05, 2.6, 0.35, size=10, italic=True, color=C_GRAY)
    add_text(s, desc, 7.05, ty+0.42, 5.55, 0.6, size=9, color=C_DARK)

# ══════════════════════════════════════════════════════════════
# SLIDE 9 — IMPLEMENTATION SUMMARY TABLE
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Implementation Summary", "Theory → Code — Every change maps to a specific HCI principle")
divider(s, 1.12)

rows = [
    ("Password Show/Hide Toggle",       "Norman — Affordance",         "AuthScreens.jsx",   "Reduces login failures from mistyped passwords"),
    ("Per-field Inline Validation",     "Nielsen H5 + Shneiderman R6", "AuthScreens.jsx",   "Errors caught at input, not at server"),
    ("Required-field Legend (*)",       "Norman — Signifiers",         "AuthScreens.jsx",   "Users instantly know which fields are mandatory"),
    ("Demo Login Spinner",              "Shneiderman R2 + Nielsen H1", "AuthScreens.jsx",   "System status always visible during login"),
    ("Sidebar Toggle Button 38px",      "Fitts's Law",                 "Sidebar.jsx",        "Larger target = faster, more accurate clicks"),
    ("Sign Out Confirmation",           "Shneiderman R4 + Nielsen H3", "Sidebar.jsx",        "Accidental logouts prevented"),
    ("Doctor Deactivation Modal",       "Shneiderman R4 + Nielsen H3", "ManageDoctors.jsx", "Clinical staff can't deactivate accidentally"),
    ("Deactivate → Amber Button",       "Norman — Conceptual Models",  "ManageDoctors.jsx", "Colour semantics: amber=caution, red=danger"),
    ("Empty State on Search",           "Nielsen H6 + Gestalt",        "ManageDoctors.jsx", "Users recognise the state; know how to recover"),
    ("Warning Toast Type",              "Shneiderman R2",              "Toast.jsx",          "4-level feedback: success/info/warning/danger"),
    ("Focus Rings (:focus-visible)",    "WCAG 2.1 AA",                 "components.css",    "Keyboard users can navigate the full interface"),
    ("ARIA on Modal + Focus Trap",      "WCAG 2.1 AA + Nielsen H4",    "Modal.jsx",          "Screen readers describe dialog; focus contained"),
    ("Form Error/Success CSS States",   "Norman — Feedback",           "components.css",    "Colour-coded borders signal validity instantly"),
    ("Mobile Responsive Auth Screen",   "Human-Centred Design",        "layout.css",         "Login form usable on all screen sizes"),
]

# Header row
cols_w = [3.2, 2.8, 2.1, 4.5]
cols_x = [0.25, 3.5, 6.35, 8.5]
headers = ["Improvement", "HCI Principle", "File Changed", "User Benefit"]
for j, (hdr, cx, cw) in enumerate(zip(headers, cols_x, cols_w)):
    add_rect(s, cx, 1.18, cw, 0.38, fill=C_DARK_BLUE)
    add_text(s, hdr, cx+0.05, 1.2, cw-0.1, 0.34, size=10, bold=True,
             color=C_WHITE, align=PP_ALIGN.CENTER)

row_h = 0.38
for i, row in enumerate(rows):
    ty = 1.58 + i * row_h
    bg = C_WHITE if i % 2 == 0 else C_LIGHT_GRAY
    add_rect(s, 0.25, ty, 13.0, row_h, fill=bg)
    for j, (cell, cx, cw) in enumerate(zip(row, cols_x, cols_w)):
        fc = C_DARK_BLUE if j == 2 else C_DARK
        add_text(s, cell, cx+0.05, ty+0.05, cw-0.1, row_h-0.06,
                 size=9, color=fc, bold=(j==2))

# ══════════════════════════════════════════════════════════════
# SLIDE 10 — BEFORE / AFTER SCREENSHOTS (TEXT REPRESENTATION)
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Key UI Changes — Before & After", "Visualising the HCI improvements in the interface")
divider(s, 1.12)

changes = [
    {
        "title": "1.  Sign Out — Confirmation Added",
        "before_lines": ["[ Sign Out ]  ← Immediately logs out", "No warning, no cancel option"],
        "after_lines":  ["⚠  Sign out of MediPulse?", "[ Sign Out ]    [ Cancel ]", "← User can safely abort"],
        "principle": "Shneiderman Rule 4 + Nielsen H3"
    },
    {
        "title": "2.  Registration — Inline Validation",
        "before_lines": ["Full Name: [             ]", "Email:     [             ]", "← No hints, no error messages"],
        "after_lines":  ["Full Name *: [ Jane Smith  ] ✅", "Email *:     [ bad-email  ] ❌", "⚠ Please enter a valid email address"],
        "principle": "Nielsen H5 + Shneiderman Rule 6"
    },
    {
        "title": "3.  Password — Show/Hide Toggle",
        "before_lines": ["Password: [••••••••]", "← No way to verify typing", "← Leads to login failures"],
        "after_lines":  ["Password: [••••••••] 👁", "← Click eye to reveal/hide", "← Reduces login errors"],
        "principle": "Norman — Affordance & Feedback"
    },
    {
        "title": "4.  Empty Search State",
        "before_lines": ["[Search: 'zzz']", "┌─────────────┐", "│             │  ← Blank white space", "└─────────────┘"],
        "after_lines":  ["[Search: 'zzz']", "   🩺  No doctors found", "No results for 'zzz'.", "[ Clear Filters ]"],
        "principle": "Nielsen H6 + Gestalt (Figure-Ground)"
    },
]

for i, ch in enumerate(changes):
    col = i % 2
    row = i // 2
    lx = 0.35 + col * 6.5
    ty = 1.28 + row * 2.85

    add_rect(s, lx, ty, 6.2, 2.6, fill=C_LIGHT_GRAY)
    add_text(s, ch["title"], lx+0.1, ty+0.06, 6.0, 0.4, size=12, bold=True, color=C_DARK_BLUE)

    # Before box
    add_rect(s, lx+0.1, ty+0.52, 2.8, 1.85, fill=RGBColor(0xFF,0xF1,0xF2))
    add_rect(s, lx+0.1, ty+0.52, 2.8, 0.3, fill=C_ROSE)
    add_text(s, "❌ Before", lx+0.15, ty+0.55, 2.7, 0.24, size=9, bold=True, color=C_WHITE)
    add_text(s, "\n".join(ch["before_lines"]), lx+0.15, ty+0.87, 2.7, 1.45, size=9, color=C_DARK)

    # After box
    add_rect(s, lx+3.2, ty+0.52, 2.8, 1.85, fill=RGBColor(0xEC,0xFD,0xF5))
    add_rect(s, lx+3.2, ty+0.52, 2.8, 0.3, fill=C_EMERALD)
    add_text(s, "✅ After",  lx+3.25, ty+0.55, 2.7, 0.24, size=9, bold=True, color=C_WHITE)
    add_text(s, "\n".join(ch["after_lines"]), lx+3.25, ty+0.87, 2.7, 1.45, size=9, color=C_DARK)

    # principle tag
    pill_box(s, ch["principle"], lx+0.1, ty+2.44, 6.0, 0.26,
             bg=C_LIGHT_BLUE, fg=C_DARK_BLUE)

# ══════════════════════════════════════════════════════════════
# SLIDE 11 — BACKEND VERIFICATION
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Backend Verification Results", "Express.js REST API tested — all endpoints confirmed working")
divider(s, 1.12)

# Architecture box
add_rect(s, 0.45, 1.28, 12.4, 0.85, fill=C_LIGHT_GRAY)
add_textbox_multi(s, [
    ("Architecture:  ", 12, True, C_DARK_BLUE),
    ("React (Frontend)  ⟷  Express.js REST API  ⟷  JSON Flat-file Database  |  JWT Authentication", 12, False, C_DARK),
], 0.6, 1.38, 12.1, 0.65)

# Test results table
tests = [
    ("GET  /api/health",         "Backend health check",         "✅ PASS", '{"status":"healthy","version":"1.0.0"}'),
    ("POST /api/auth/login",     "Patient demo login + JWT",     "✅ PASS", "Returns user object + signed JWT token"),
    ("POST /api/auth/login",     "Doctor demo login",            "✅ PASS", "Returns doctor user + JWT"),
    ("POST /api/auth/login",     "Admin demo login",             "✅ PASS", "Returns admin user + JWT"),
    ("GET  /api/doctors",        "Fetch all doctors",            "✅ PASS", "Returns 6 doctors with full clinical data"),
    ("GET  /api/appointments",   "Fetch appointments",           "✅ PASS", "Returns confirmed appointments list"),
    ("GET  /api/patients",       "Fetch patient list",           "✅ PASS", "Returns registered patient records"),
    ("GET  /api/nonexistent",    "404 error handling",           "✅ PASS", '{"success":false,"message":"endpoint not found"}'),
    ("npm run dev  (Vite)",      "Frontend dev server starts",   "✅ PASS", "Ready on http://localhost:5173"),
    ("node server/index.js",     "Backend server starts",        "✅ PASS", "Active on http://localhost:5000"),
]

hdrs = ["API Endpoint / Command", "Test Description", "Result", "Response / Output"]
hcols_x = [0.35, 4.35, 6.35, 7.6]
hcols_w = [3.95, 1.95, 1.2,  5.45]
ty = 2.28
for j, (hdr, cx, cw) in enumerate(zip(hdrs, hcols_x, hcols_w)):
    add_rect(s, cx, ty, cw, 0.38, fill=C_NAVY)
    add_text(s, hdr, cx+0.05, ty+0.04, cw-0.1, 0.3, size=10, bold=True,
             color=C_WHITE, align=PP_ALIGN.CENTER)

for i, (ep, desc, res, out) in enumerate(tests):
    ty = 2.68 + i * 0.41
    bg = C_WHITE if i % 2 == 0 else C_LIGHT_GRAY
    add_rect(s, 0.35, ty, 12.95, 0.39, fill=bg)
    rc = C_EMERALD if "PASS" in res else C_ROSE
    add_text(s, ep,   hcols_x[0]+0.05, ty+0.05, hcols_w[0]-0.1, 0.3, size=9, color=C_DARK_BLUE, bold=True)
    add_text(s, desc, hcols_x[1]+0.05, ty+0.05, hcols_w[1]-0.1, 0.3, size=9, color=C_DARK)
    add_text(s, res,  hcols_x[2]+0.05, ty+0.05, hcols_w[2]-0.1, 0.3, size=9, color=rc,  bold=True)
    add_text(s, out,  hcols_x[3]+0.05, ty+0.05, hcols_w[3]-0.1, 0.3, size=9, color=C_GRAY)

add_rect(s, 0, 7.08, 13.33, 0.42, fill=C_EMERALD)
add_text(s, "✅  All 10 tests PASSED  •  84 backend packages installed  •  0 vulnerabilities found",
         0.3, 7.12, 12.7, 0.33, size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 12 — UTILITY FILES
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Utility Files — Run & Check", "Two batch files added to the project root for easy launch & diagnostics")
divider(s, 1.12)

# Run_Project.bat
add_rect(s, 0.45, 1.28, 6.0, 5.82, fill=RGBColor(0xEC,0xFD,0xF5))
add_rect(s, 0.45, 1.28, 6.0, 0.52, fill=C_EMERALD)
add_text(s, "🚀  Run_Project.bat", 0.6, 1.32, 5.7, 0.44, size=14, bold=True, color=C_WHITE)

run_items = [
    ("What it does:", "Starts both servers with one double-click."),
    ("Step 1:", "Checks Node.js is installed"),
    ("Step 2:", "Verifies frontend node_modules exist"),
    ("Step 3:", "Verifies backend node_modules exist"),
    ("Step 4:", "Warns if port 5000 is already in use"),
    ("Step 5:", "Opens backend terminal → http://localhost:5000"),
    ("Step 6:", "Opens frontend terminal → http://localhost:5173"),
    ("On error:", "Shows exact fix command — never silent failure"),
]
for i, (lbl, desc) in enumerate(run_items):
    ty = 2.0 + i * 0.61
    add_text(s, lbl,  0.65, ty, 1.5, 0.5, size=10, bold=True, color=C_EMERALD)
    add_text(s, desc, 2.1,  ty, 4.2, 0.5, size=10, color=C_DARK)

# Check_Requirements.bat
add_rect(s, 6.9, 1.28, 6.0, 5.82, fill=RGBColor(0xFF,0xFB,0xEB))
add_rect(s, 6.9, 1.28, 6.0, 0.52, fill=C_AMBER)
add_text(s, "🔍  Check_Requirements.bat", 7.05, 1.32, 5.7, 0.44, size=14, bold=True, color=C_WHITE)

chk_items = [
    ("[PASS]",    "Node.js 20.18.0 detected"),
    ("[PASS]",    "npm v10.x found"),
    ("[PASS]",    "Frontend node_modules present"),
    ("[PASS]",    "Backend node_modules present"),
    ("[PASS]",    "Port 5000 available"),
    ("[PASS]",    "Port 5173 available"),
    ("[PASS]",    "All essential files found"),
    ("[PASS]",    "All packages installed (deep check)"),
]
add_text(s, "Sample output:", 7.05, 2.0, 5.5, 0.38, size=10, bold=True, color=C_AMBER)
for i, (status, msg) in enumerate(chk_items):
    ty = 2.45 + i * 0.55
    sc = C_EMERALD if "PASS" in status else (C_ROSE if "FAIL" in status else C_AMBER)
    add_rect(s, 7.05, ty, 5.75, 0.45, fill=C_WHITE)
    add_text(s, status, 7.1,  ty+0.08, 0.85, 0.3, size=10, bold=True, color=sc)
    add_text(s, msg,    7.95, ty+0.08, 4.7,  0.3, size=10, color=C_DARK)

add_rect(s, 0, 7.08, 13.33, 0.42, fill=C_DARK)
add_text(s, "Run Check_Requirements.bat FIRST  →  then Run_Project.bat  →  open http://localhost:5173",
         0.3, 7.12, 12.7, 0.33, size=11, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 13 — FILES CHANGED
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_WHITE)
slide_header(s, "Files Modified & Created", "Targeted changes only — existing functionality 100% preserved")
divider(s, 1.12)

files = [
    ("MODIFIED", "src/styles/components.css",            "Focus rings, form error/success states, btn-warning, toast-warning"),
    ("MODIFIED", "src/styles/index.css",                 "Spin animation, .spinner, .sr-only utility, --amber-700 token"),
    ("MODIFIED", "src/styles/layout.css",                "Mobile responsive auth screen (640px breakpoint)"),
    ("MODIFIED", "src/components/common/Modal.jsx",      "ARIA attributes, focus trap, auto-focus on open"),
    ("MODIFIED", "src/components/common/Toast.jsx",      "Warning toast type, role=alert, aria-live announcements"),
    ("MODIFIED", "src/components/common/Sidebar.jsx",    "Fitts's Law button size, Sign Out confirmation, aria-current"),
    ("MODIFIED", "src/components/auth/AuthScreens.jsx",  "Password toggle, validation, spinner, required legend, mobile"),
    ("MODIFIED", "src/components/admin/ManageDoctors.jsx","Deactivation confirmation modal, empty state, colour fix"),
    ("NEW",      "Run_Project.bat",                      "One-click launcher — starts backend + frontend automatically"),
    ("NEW",      "Check_Requirements.bat",               "PASS/WARN/FAIL prerequisite diagnostic checker"),
    ("NEW",      "check_requirements.js",                "Node.js deep dependency & version validator"),
]

cols_x = [0.35, 1.65, 5.35]
cols_w = [1.25, 3.65, 7.15]
hds    = ["Type", "File", "What Changed"]
ty = 1.28
for j, (hd, cx, cw) in enumerate(zip(hds, cols_x, cols_w)):
    add_rect(s, cx, ty, cw, 0.36, fill=C_NAVY)
    add_text(s, hd, cx+0.05, ty+0.04, cw-0.1, 0.28, size=10, bold=True,
             color=C_WHITE, align=PP_ALIGN.CENTER)

for i, (typ, fname, what) in enumerate(files):
    ty = 1.66 + i * 0.47
    bg = C_WHITE if i % 2 == 0 else C_LIGHT_GRAY
    add_rect(s, 0.35, ty, 12.95, 0.45, fill=bg)
    tc = C_EMERALD if typ == "NEW" else C_DARK_BLUE
    add_text(s, typ,   cols_x[0]+0.05, ty+0.07, cols_w[0]-0.1, 0.32, size=9,  bold=True, color=tc)
    add_text(s, fname, cols_x[1]+0.05, ty+0.07, cols_w[1]-0.1, 0.32, size=9,  color=C_DARK_BLUE, bold=True, italic=True)
    add_text(s, what,  cols_x[2]+0.05, ty+0.07, cols_w[2]-0.1, 0.32, size=9,  color=C_DARK)

add_rect(s, 0.35, 6.83, 12.95, 0.5, fill=C_LIGHT_BLUE)
add_text(s, "✅  8 files modified  •  3 new files created  •  Core architecture, routing, and data unchanged",
         0.5, 6.88, 12.7, 0.38, size=11, bold=True, color=C_DARK_BLUE, align=PP_ALIGN.CENTER)

# ══════════════════════════════════════════════════════════════
# SLIDE 14 — CONCLUSION
# ══════════════════════════════════════════════════════════════
s = prs.slides.add_slide(BLANK)
add_rect(s, 0, 0, 13.33, 7.5, fill=C_NAVY)
add_rect(s, 0, 0, 0.18, 7.5, fill=C_DARK_BLUE)
add_rect(s, 0.18, 0, 0.08, 7.5, fill=C_ACCENT)

# Decorative circles
for cx, cy, cw in [(9,5,6),(10,0.5,4),(0.5,6,3)]:
    shape = s.shapes.add_shape(9, Inches(cx), Inches(cy), Inches(cw), Inches(cw))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(0x07,0x59,0x85)
    shape.line.fill.background()

add_text(s, "Conclusion", 0.7, 0.5, 8, 0.85,
         size=36, bold=True, color=C_WHITE)
add_rect(s, 0.7, 1.35, 3.5, 0.06, fill=C_ACCENT)

add_text(s, "What was achieved in this HCI project:", 0.7, 1.55, 9, 0.5,
         size=16, color=RGBColor(0xBA,0xE6,0xFD))

summary_pts = [
    ("14",  "usability problems identified and resolved"),
    ("6",   "distinct HCI theories applied from course materials"),
    ("11",  "source files modified or created"),
    ("8",   "Shneiderman Golden Rules demonstrated"),
    ("4",   "Nielsen Heuristics implemented (H1, H3, H5, H6)"),
    ("100%","of existing features preserved — no rebuilding"),
    ("10",  "backend API tests passed — 0 vulnerabilities"),
]
for i, (num, desc) in enumerate(summary_pts):
    ty = 2.1 + i * 0.65
    add_rect(s, 0.7, ty, 1.0, 0.52, fill=C_DARK_BLUE)
    add_text(s, num,  0.72, ty+0.06, 0.96, 0.42, size=18, bold=True,
             color=C_ACCENT, align=PP_ALIGN.CENTER)
    add_text(s, desc, 1.82, ty+0.1,  7.5,  0.35, size=13, color=C_WHITE)

# Right side key message
add_rect(s, 9.8, 1.3, 3.3, 5.85, fill=C_DARK_BLUE)
add_text(s, "Key Takeaway", 9.95, 1.45, 3.0, 0.45, size=14, bold=True, color=C_ACCENT)
add_rect(s, 9.95, 1.9, 3.0, 0.04, fill=C_ACCENT)
add_text(s,
    "Every change in this project is:\n\n"
    "→  Directly traceable to a\n"
    "    course HCI principle\n\n"
    "→  Implemented in real code\n\n"
    "→  Tested and verified\n\n"
    "→  Explained with UX benefit",
    9.95, 2.0, 3.1, 4.9, size=12, color=C_WHITE)

add_rect(s, 0, 7.08, 13.33, 0.42, fill=C_DARK_BLUE)
add_text(s, "MediPulse HMS  •  BCSE415L Human-Computer Interaction  •  HCI Course Project",
         0.3, 7.12, 12.7, 0.33, size=10, color=RGBColor(0xBA,0xE6,0xFD), align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────────
output_path = r"e:\Placement Project\class project\MediPulse_HCI_Presentation.pptx"
prs.save(output_path)
print("[DONE] Presentation saved to:")
print("       " + output_path)
print(f"       Total slides: {len(prs.slides)}")
