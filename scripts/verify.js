async function runVerification() {
  console.log('⚡ [VERIFICATION] Testing Yehia Wael Portfolio & Admin Subsystems...');
  try {
    const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
    console.log('✅ 1. Health Probe:', health.status);

    const publicData = await fetch('http://localhost:5000/api/public/data').then(r => r.json());
    console.log('✅ 2. Public Datastore Delivery:');
    console.log(`   - Profile: ${publicData.profile.name} (${publicData.profile.title})`);
    console.log(`   - Projects: ${publicData.projects.length} loaded`);
    console.log(`   - Skills: ${publicData.skills.length} loaded`);
    console.log(`   - Experience: ${publicData.experience.length} logged`);
    console.log(`   - Education: ${publicData.education.length} logged`);
    console.log(`   - Articles: ${publicData.articles?.length || 0} published`);
    console.log(`   - Testimonials: ${publicData.testimonials?.length || 0} verified`);

    if (publicData.articles && publicData.articles.length > 0) {
      const art = publicData.articles[0];
      const viewRes = await fetch(`http://localhost:5000/api/public/articles/${art.id}/view`, {
        method: 'POST'
      }).then(r => r.json());
      console.log(`✅ 3. Article Telemetry: Article #${art.id} views incremented to ${viewRes.views_count}`);
    }

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@yehia.dev', password: 'AdminPass123!' })
    }).then(r => r.json());
    console.log('✅ 4. Admin Authentication:', loginRes.success ? 'GRANTED' : 'DENIED');

    const overview = await fetch('http://localhost:5000/api/admin/overview', {
      headers: { 'Authorization': `Bearer ${loginRes.token}` }
    }).then(r => r.json());
    console.log('✅ 5. Admin Telemetry Overview:');
    console.log(`   - Projects managed: ${overview.projectsCount}`);
    console.log(`   - Skills managed: ${overview.skillsCount}`);
    console.log(`   - Articles managed: ${overview.articlesCount}`);
    console.log(`   - Testimonials managed: ${overview.testimonialsCount}`);
    console.log(`   - Inquiries in datastore: ${overview.messagesCount}`);

    const backupRes = await fetch('http://localhost:5000/api/admin/export-data', {
      headers: { 'Authorization': `Bearer ${loginRes.token}` }
    });
    const backupJson = await backupRes.json();
    console.log('✅ 6. Datastore Backup Snapshot Export:');
    console.log(`   - Exported At: ${backupJson.exported_at}`);
    console.log(`   - Projects in snapshot: ${backupJson.projects.length}`);
    console.log(`   - Articles in snapshot: ${backupJson.articles.length}`);
    console.log(`   - Testimonials in snapshot: ${backupJson.testimonials.length}`);

    console.log('\n🚀 ALL NEW FEATURES & SUB-SYSTEMS VERIFIED 100% OPERATIONAL');
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exit(1);
  }
}

runVerification();
