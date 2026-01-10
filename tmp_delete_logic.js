
        window.showAdminDashboard = () => {
            renderAdminUserList();
            const btn = document.getElementById('deleteAllBtn');
            if (currentUser && currentUser.role === 'super_admin') {
                btn.classList.remove('d-none');
            } else {
                btn.classList.add('d-none');
            }
            bootstrap.Modal.getOrCreateInstance(document.getElementById('adminDashboardModal')).show();
        };

        window.deleteAllUsers = async () => {
            if (!currentUser || currentUser.role !== 'super_admin') return;

            if (!confirm("⚠️ 危險操作警告 (1/3)\n\n您確定要「刪除所有人員」嗎？\n\n此操作將清空系統中除了您以外的所有使用者資料！\n資料一旦刪除將無法復原！")) return;
            if (!confirm("⚠️ 再次確認 (2/3)\n\n真的要刪除嗎？\n\n這會造成嚴重的資料遺失，請確認您知道自己在做什麼！")) return;
            if (!confirm("⛔ 最後確認 (3/3)\n\n這是最後一次機會。\n\n點擊「確定」將立即開始刪除。\n點擊「取消」可以中止操作。")) return;

            const candidates = studentsData.filter(s => s.id !== currentUser.id);
            if (candidates.length === 0) {
                alert("沒有其他人員可供刪除。");
                return;
            }

            // Show loading
            const btn = document.getElementById('deleteAllBtn');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 刪除中...';

            try {
                // Batch delete (limit 500 per batch)
                // Since we are using client side loop for simplicity given unknown batch utils
                // But Firestore batch is better.
                // Re-import writeBatch if needed? writeBatch is available from 'firebase/firestore'
                // Assuming writeBatch is available or import it.
                // Let's use simple Promise.all or chunks to avoid complexity if import is hard
                // Actually, let's look at imports. 
                // Using updateDoc/deleteDoc. `deleteDoc(doc(db, "students", id))`
                
                // Let's try batch
                // import { writeBatch } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
                // But imports are at top of module.
                // I will use `deleteDoc` in loop for simplicity, it might be slower but safer to implement without touching imports.
                
                let count = 0;
                for (const student of candidates) {
                    await deleteDoc(doc(db, "students", student.id));
                    count++;
                }

                alert(`已成功刪除 ${count} 位人員。`);
                renderAdminUserList();
            } catch (e) {
                console.error(e);
                alert("刪除過程中發生錯誤：" + e.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        };
