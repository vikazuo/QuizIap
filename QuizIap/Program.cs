using QuizIap.Configurations;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

builder.AddMvcConfiguration();
services.AddControllersWithViews();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();