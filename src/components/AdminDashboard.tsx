import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Edit2, LogOut, Save, X, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { Player } from "../types";
import { api } from "../lib/api";

interface AdminDashboardProps {
  players: Player[];
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminDashboard = ({ players, onLogout, onViewSite }: AdminDashboardProps) => {
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async (player: Partial<Player>) => {
    try {
      if (editingPlayer) {
        await api.updatePlayer(editingPlayer.id, player);
      } else {
        await api.createPlayer(player as Omit<Player, "id">);
      }
      setEditingPlayer(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= players.length) return;

    const currentPlayer = players[index];
    const targetPlayer = players[targetIndex];

    const currentOrder = currentPlayer.display_order ?? index;
    const targetOrder = targetPlayer.display_order ?? targetIndex;

    const newCurrentOrder = targetOrder === currentOrder 
      ? (direction === 'up' ? currentOrder - 1 : currentOrder + 1) 
      : targetOrder;
    const newTargetOrder = currentOrder;

    // Swap position order in database
    await api.updatePlayer(currentPlayer.id, { display_order: newCurrentOrder });
    await api.updatePlayer(targetPlayer.id, { display_order: newTargetOrder });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS PROFILE?")) {
      try {
        await api.deletePlayer(id);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleLogout = async () => {
    await api.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase glitch-text">
              DASHBOARD
            </h1>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] mt-2">
              PLAYER PROFILE MANAGEMENT
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 font-bold uppercase tracking-widest hover:bg-white/90 transition-colors"
            >
              <Plus size={20} /> ADD PLAYER
            </button>
            <button
              onClick={onViewSite}
              className="flex items-center gap-2 border border-white/20 px-6 py-3 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              VIEW SITE
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-red-500/20 text-red-500 px-6 py-3 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
            >
              <LogOut size={20} /> EXIT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((player, index) => (
            <div
              key={player.id}
              className="border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
            >
              <div className="aspect-video bg-black/50 border border-white/10 overflow-hidden">
                <img
                  src={player.image}
                  alt={player.alias}
                  className="w-full h-full object-cover silhouette-img opacity-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase">{player.alias}</h3>
                <p className="text-xs text-white/50 uppercase tracking-widest">
                  {player.callsign}
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-2 border border-white/20 disabled:opacity-20 hover:bg-white hover:text-black transition-colors"
                  title="Move Left / Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  disabled={index === players.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-2 border border-white/20 disabled:opacity-20 hover:bg-white hover:text-black transition-colors"
                  title="Move Right / Down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => setEditingPlayer(player)}
                  className="flex-1 border border-white/20 p-2 hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase"
                >
                  <Edit2 size={14} /> EDIT
                </button>
                <button
                  onClick={() => handleDelete(player.id)}
                  className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editingPlayer || isAdding) && (
        <PlayerForm
          player={editingPlayer || undefined}
          onSave={handleSave}
          onCancel={() => {
            setEditingPlayer(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
};

const PlayerForm = ({
  player,
  onSave,
  onCancel,
}: {
  player?: Player;
  onSave: (p: Partial<Player>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<Player>>(
    player || {
      alias: "",
      quote: "",
      callsign: "",
      function: "",
      combatProfile: "",
      primaryWeapon: "",
      status: "ACTIVE",
      image: "https://picsum.photos/seed/new/400/600",
      ultimate_image: "",
    }
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUltimateFile, setSelectedUltimateFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(formData.image || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10000000) {
        alert("FILE TOO LARGE. PLEASE UPLOAD AN IMAGE UNDER 10MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUltimateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10000000) {
        alert("FILE TOO LARGE. PLEASE UPLOAD AN IMAGE UNDER 10MB.");
        return;
      }
      setSelectedUltimateFile(file);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      let imageUrl = formData.image;
      let ultimateImageUrl = formData.ultimate_image;

      if (selectedFile) {
        const uploadedUrl = await api.uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          alert("FAILED TO UPLOAD IMAGE. CHECK STORAGE PERMISSIONS.");
          setIsSaving(false);
          return;
        }
      }

      if (selectedUltimateFile) {
        const uploadedUrl = await api.uploadImage(selectedUltimateFile);
        if (uploadedUrl) ultimateImageUrl = uploadedUrl;
      }

      onSave({ ...formData, image: imageUrl, ultimate_image: ultimateImageUrl });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("AN ERROR OCCURRED WHILE SAVING.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border border-white/20 bg-black p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black uppercase">
            {player ? "EDIT PROFILE" : "NEW PROFILE"}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-white hover:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-black/50 border border-white/10 overflow-hidden relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover silhouette-img"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest">PREVIEW</p>
              </div>
            </div>
            <Field
              label="ALIAS"
              value={formData.alias}
              onChange={(v) => setFormData({ ...formData, alias: v })}
            />
            <Field
              label="CALLSIGN"
              value={formData.callsign}
              onChange={(v) => setFormData({ ...formData, callsign: v })}
            />
          </div>
          <div className="space-y-4">
            <Field
              label="FUNCTION"
              value={formData.function}
              onChange={(v) => setFormData({ ...formData, function: v })}
            />
            <Field
              label="STATUS"
              value={formData.status}
              onChange={(v) => setFormData({ ...formData, status: v })}
            />
            <Field
              label="COMBAT PROFILE"
              value={formData.combatProfile}
              onChange={(v) => setFormData({ ...formData, combatProfile: v })}
            />
            <Field
              label="PRIMARY WEAPON"
              value={formData.primaryWeapon}
              onChange={(v) => setFormData({ ...formData, primaryWeapon: v })}
            />
            <div className="space-y-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest">IMAGE SOURCE</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setPreviewUrl(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="URL OR UPLOAD"
                  className="flex-1 bg-transparent border border-white/20 p-2 font-mono text-xs focus:border-white outline-none"
                />
                <label className="cursor-pointer bg-white/10 border border-white/20 p-2 hover:bg-white hover:text-black transition-colors flex items-center justify-center">
                  <Upload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-[8px] text-white/30 uppercase">MAX SIZE: 2MB // PREFER SILHOUETTES</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest">ULTIMATE IMAGE SOURCE</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.ultimate_image || ""}
                  onChange={(e) => setFormData({ ...formData, ultimate_image: e.target.value })}
                  placeholder="ULTIMATE IMAGE URL OR UPLOAD"
                  className="flex-1 bg-transparent border border-white/20 p-2 font-mono text-xs focus:border-white outline-none"
                />
                <label className="cursor-pointer bg-white/10 border border-white/20 p-2 hover:bg-white hover:text-black transition-colors flex items-center justify-center">
                  <Upload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUltimateFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/50 uppercase tracking-widest">QUOTE</label>
              <textarea
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full bg-transparent border border-white/20 p-2 font-mono text-sm focus:border-white outline-none h-20"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 bg-white text-black py-4 font-black uppercase tracking-widest hover:bg-white/90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>UPLOADING...</>
            ) : (
              <>
                <Save size={20} /> SAVE PROFILE
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-8 border border-white/20 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-50"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1">
    <label className="text-[10px] text-white/50 uppercase tracking-widest">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-white/20 p-2 font-mono text-sm focus:border-white outline-none"
    />
  </div>
);
